import React, { useEffect, useMemo, useState } from "react";
import { theme } from "../../theme";
import {
  Note,
  createNote,
  deleteNote,
  getNote,
  listNotes,
  updateNote,
  generateNoteVideo,
  getNoteVideoStatus,
  logout as apiLogout,
} from "../../utils/api";
import { RichTextEditor } from "./Editor";
import { Sidebar } from "./Sidebar";
import { VideoPreviewPanel } from "../Video/VideoPreviewPanel";

export const NotesPage: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState<string>("");
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useMemo(
    () => notes.find((n) => n.id === selectedId) || null,
    [notes, selectedId]
  );

  useEffect(() => {
    (async () => {
      const res = await listNotes();
      if (!res.error && res.data) {
        const sorted = [...res.data].sort(
          (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        );
        setNotes(sorted);
        setSelectedId(sorted[0]?.id || null);
      }
      setLoading(false);
    })();
  }, []);

  useEffect(() => {
    (async () => {
      if (!selectedId) {
        setTitle("");
        setContent("");
        return;
      }
      const res = await getNote(selectedId);
      if (!res.error && res.data) {
        setTitle(res.data.title || "");
        setContent(res.data.content || "");
      }
    })();
  }, [selectedId]);

  const onCreate = async () => {
    const res = await createNote({ title: "Untitled", content: "" });
    if (res.data) {
      setNotes((n) => [res.data!, ...n]);
      setSelectedId(res.data.id);
    }
  };

  const onSave = async () => {
    if (!selectedId) return;
    setSaving(true);
    const res = await updateNote(selectedId, { title, content });
    setSaving(false);
    if (res.data) {
      setNotes((n) =>
        n.map((it) => (it.id === selectedId ? { ...it, ...res.data! } : it))
      );
    }
  };

  const onDelete = async () => {
    if (!selectedId) return;
    if (typeof confirm !== "undefined") {
      if (!confirm("Delete this note?")) return;
    }
    setDeleting(true);
    const res = await deleteNote(selectedId);
    setDeleting(false);
    if (!res.error) {
      setNotes((n) => n.filter((it) => it.id !== selectedId));
      setSelectedId((prev) => {
        const remaining = notes.filter((it) => it.id !== prev);
        return remaining[0]?.id || null;
      });
    }
  };

  const onLogout = () => {
    apiLogout();
    window.location.reload();
  };

  // Video generation
  const [videoJobId, setVideoJobId] = useState<string | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [videoBusy, setVideoBusy] = useState(false);
  const [videoError, setVideoError] = useState<string | null>(null);

  const startGenerateVideo = async () => {
    if (!selectedId) return;
    setVideoError(null);
    setVideoBusy(true);
    const res = await generateNoteVideo(selectedId);
    setVideoBusy(false);
    if (res.error) {
      setVideoError(res.error);
      return;
    }
    if (res.data?.url) {
      setVideoUrl(res.data.url);
      setVideoJobId(null);
    } else if (res.data?.jobId) {
      setVideoJobId(res.data.jobId);
      setVideoUrl(null);
    }
  };

  useEffect(() => {
    let timer: number | null = null;
    if (videoJobId && selectedId) {
      const poll = async () => {
        const st = await getNoteVideoStatus(selectedId, videoJobId);
        if (st.data?.status === "done" && st.data.url) {
          setVideoUrl(st.data.url);
          setVideoJobId(null);
        } else if (st.data?.status === "error") {
          setVideoError(st.data.error || "Video generation failed.");
          setVideoJobId(null);
        } else {
          timer = window.setTimeout(poll, 2000);
        }
      };
      poll();
    }
    return () => {
      if (timer) window.clearTimeout(timer);
    };
  }, [videoJobId, selectedId]);

  return (
    <div style={styles.layout}>
      <Sidebar
        notes={notes}
        selectedId={selectedId}
        onSelect={setSelectedId}
        onCreate={onCreate}
        onLogout={onLogout}
        loading={loading}
      />
      <main style={styles.main}>
        <div style={styles.toolbar}>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Note title"
            style={styles.titleInput}
          />
          <div style={{ display: "flex", gap: 8 }}>
            <button style={styles.secondaryBtn} onClick={onDelete} disabled={!selectedId || deleting}>
              {deleting ? "Deleting..." : "Delete"}
            </button>
            <button style={styles.primaryBtn} onClick={onSave} disabled={!selectedId || saving}>
              {saving ? "Saving..." : "Save"}
            </button>
          </div>
        </div>
        <div style={styles.contentWrap}>
          <section style={styles.editorWrap}>
            <RichTextEditor value={content} onChange={setContent} />
          </section>
          <aside style={styles.previewWrap}>
            <VideoPreviewPanel
              title={title}
              html={content}
              onGenerate={startGenerateVideo}
              videoUrl={videoUrl}
              busy={videoBusy || !!videoJobId}
              error={videoError}
              onShare={() => {
                if (videoUrl) {
                  if (typeof navigator !== "undefined" && navigator.clipboard) {
                    navigator.clipboard.writeText(videoUrl);
                  }
                  if (typeof alert !== "undefined") {
                    alert("Video URL copied to clipboard!");
                  }
                }
              }}
            />
          </aside>
        </div>
      </main>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  layout: {
    display: "flex",
    minHeight: "100vh",
    background: theme.colors.subtle,
  },
  main: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    minWidth: 0,
  },
  toolbar: {
    display: "flex",
    justifyContent: "space-between",
    gap: 12,
    alignItems: "center",
    padding: 16,
    borderBottom: `1px solid ${theme.colors.border}`,
    background: theme.colors.bg,
  },
  titleInput: {
    flex: 1,
    padding: "10px 12px",
    fontSize: 16,
    border: `1px solid ${theme.colors.border}`,
    borderRadius: theme.radius.md,
    outline: "none",
  },
  contentWrap: {
    display: "grid",
    gridTemplateColumns: "1fr 420px",
    gap: 16,
    padding: 16,
  },
  editorWrap: {
    minWidth: 0,
  },
  previewWrap: {
    minWidth: 320,
  },
};
