import React from "react";
import { theme } from "../../theme";
import { NoteVideoComposition } from "./composition/NoteVideoComposition";
import { Player } from "@remotion/player";

type Props = {
  title: string;
  html: string;
  onGenerate: () => void;
  onShare: () => void;
  videoUrl: string | null;
  busy: boolean;
  error: string | null;
};

export const VideoPreviewPanel: React.FC<Props> = ({
  title,
  html,
  onGenerate,
  onShare,
  videoUrl,
  busy,
  error,
}) => {
  return (
    <div style={styles.card}>
      <h3 style={styles.title}>Preview & Share</h3>
      <div style={styles.playerBox}>
        <Player
          component={NoteVideoComposition}
          inputProps={{ title, html }}
          durationInFrames={300}
          fps={30}
          compositionWidth={854}
          compositionHeight={480}
          style={{ width: "100%", borderRadius: 12, background: "#000" }}
          controls
        />
      </div>
      <div style={styles.actions}>
        <button style={styles.primaryBtn} onClick={onGenerate} disabled={busy}>
          {busy ? "Generating..." : "Generate Video"}
        </button>
        <button style={styles.secondaryBtn} onClick={onShare} disabled={!videoUrl}>
          Copy Share Link
        </button>
      </div>
      {videoUrl && (
        <div style={styles.infoBox}>
          <div style={styles.infoLabel}>Video URL</div>
          <a href={videoUrl} target="_blank" rel="noreferrer" style={styles.link}>
            {videoUrl}
          </a>
        </div>
      )}
      {error && <div style={styles.error}>{error}</div>}
      <p style={styles.hint}>
        The left preview is rendered locally in your browser using Remotion. Use Generate to render
        a sharable video via the backend video engine.
      </p>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  card: {
    border: `1px solid ${theme.colors.border}`,
    background: theme.colors.bg,
    borderRadius: theme.radius.lg,
    padding: 14,
    boxShadow: theme.shadow.md,
    position: "sticky",
    top: 16,
  },
  title: { margin: "4px 0 8px 0", color: theme.colors.text },
  playerBox: {
    width: "100%",
    background: "#000",
    borderRadius: 12,
    overflow: "hidden",
  },
  actions: {
    display: "flex",
    gap: 8,
    marginTop: 12,
  },
  primaryBtn: {
    padding: "10px 12px",
    background: theme.colors.accent,
    color: "white",
    border: "none",
    borderRadius: theme.radius.md,
    cursor: "pointer",
    fontWeight: 700,
  },
  secondaryBtn: {
    padding: "10px 12px",
    background: "white",
    color: theme.colors.text,
    border: `1px solid ${theme.colors.border}`,
    borderRadius: theme.radius.md,
    cursor: "pointer",
  },
  infoBox: {
    marginTop: 12,
    padding: 10,
    borderRadius: theme.radius.md,
    background: theme.colors.subtle,
    border: `1px solid ${theme.colors.border}`,
  },
  infoLabel: { fontSize: 12, color: theme.colors.mutedText, marginBottom: 6 },
  link: { color: theme.colors.primary, wordBreak: "break-all" as const },
  error: { color: theme.colors.accent, marginTop: 8 },
  hint: { fontSize: 12, color: theme.colors.mutedText, marginTop: 8 },
};
