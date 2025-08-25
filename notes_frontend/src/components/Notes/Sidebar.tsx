import React from "react";
import { theme } from "../../theme";
import { Note } from "../../utils/api";

type Props = {
  notes: Note[];
  selectedId?: string | null;
  onSelect: (id: string) => void;
  onCreate: () => void;
  onLogout: () => void;
  loading?: boolean;
};

export const Sidebar: React.FC<Props> = ({
  notes,
  selectedId,
  onSelect,
  onCreate,
  onLogout,
  loading,
}) => {
  return (
    <aside style={styles.container}>
      <div style={styles.header}>
        <div style={styles.brand}>
          <div style={styles.logoDot} />
          <span>NoteVision</span>
        </div>
        <button style={styles.createBtn} onClick={onCreate}>
          + New
        </button>
      </div>

      <div style={styles.list}>
        {loading ? (
          <div style={styles.loading}>Loading notes...</div>
        ) : notes.length === 0 ? (
          <div style={styles.empty}>No notes yet. Create one!</div>
        ) : (
          notes.map((n) => (
            <button
              key={n.id}
              style={{
                ...styles.item,
                ...(n.id === selectedId ? styles.itemActive : {}),
              }}
              onClick={() => onSelect(n.id)}
              title={n.title}
            >
              <div style={styles.itemTitle}>{n.title || "Untitled"}</div>
              <div style={styles.itemTime}>
                {new Date(n.updatedAt || n.createdAt).toLocaleString()}
              </div>
            </button>
          ))
        )}
      </div>

      <div style={styles.footer}>
        <button style={styles.logoutBtn} onClick={onLogout}>
          Logout
        </button>
      </div>
    </aside>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: {
    width: 300,
    minWidth: 260,
    borderRight: `1px solid ${theme.colors.border}`,
    display: "flex",
    flexDirection: "column",
    background: "#FCFDFF",
    height: "100%",
  },
  header: {
    padding: 16,
    borderBottom: `1px solid ${theme.colors.border}`,
    display: "flex",
    gap: 8,
    alignItems: "center",
    justifyContent: "space-between",
  },
  brand: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    color: theme.colors.text,
    fontWeight: 700,
  },
  logoDot: {
    width: 12,
    height: 12,
    borderRadius: 12,
    background: `linear-gradient(135deg, ${theme.colors.primary}, ${theme.colors.accent})`,
    boxShadow: "0 0 0 2px rgba(51,102,255,0.15)",
  },
  createBtn: {
    padding: "8px 12px",
    background: theme.colors.primary,
    color: "white",
    border: "none",
    borderRadius: theme.radius.sm,
    cursor: "pointer",
    fontWeight: 600,
  },
  list: {
    padding: 8,
    flex: 1,
    overflowY: "auto",
  },
  loading: {
    color: theme.colors.mutedText,
    padding: 12,
  },
  empty: {
    color: theme.colors.mutedText,
    padding: 12,
    fontStyle: "italic",
  },
  item: {
    width: "100%",
    padding: 12,
    textAlign: "left" as const,
    border: `1px solid transparent`,
    background: "transparent",
    borderRadius: theme.radius.md,
    cursor: "pointer",
    marginBottom: 8,
  },
  itemActive: {
    background: theme.colors.subtle,
    borderColor: theme.colors.border,
  },
  itemTitle: {
    fontWeight: 600,
    color: theme.colors.text,
    whiteSpace: "nowrap" as const,
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  itemTime: {
    fontSize: 12,
    color: theme.colors.mutedText,
    marginTop: 4,
  },
  footer: {
    padding: 12,
    borderTop: `1px solid ${theme.colors.border}`,
  },
  logoutBtn: {
    padding: "8px 10px",
    width: "100%",
    background: "white",
    border: `1px solid ${theme.colors.border}`,
    borderRadius: theme.radius.sm,
    cursor: "pointer",
  },
};
