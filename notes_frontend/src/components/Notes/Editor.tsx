import React, { useEffect, useRef } from "react";
import { theme } from "../../theme";

type Props = {
  value: string;
  onChange: (html: string) => void;
};

export const RichTextEditor: React.FC<Props> = ({ value, onChange }) => {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!ref.current) return;
    if (ref.current.innerHTML !== value) {
      ref.current.innerHTML = value || "";
    }
  }, [value]);

  const exec = (command: string, val?: string) => {
    if (typeof document !== "undefined") {
      // document.execCommand is deprecated but works broadly; keep simple.
      document.execCommand(command, false, val as any);
    }
    if (ref.current) onChange(ref.current.innerHTML);
  };

  const handleInput = () => {
    if (ref.current) {
      onChange(ref.current.innerHTML);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.toolbar}>
        <button title="Bold" style={styles.toolBtn} onClick={() => exec("bold")}>
          B
        </button>
        <button title="Italic" style={styles.toolBtn} onClick={() => exec("italic")}>
          I
        </button>
        <button title="Underline" style={styles.toolBtn} onClick={() => exec("underline")}>
          U
        </button>
        <button title="H1" style={styles.toolBtn} onClick={() => exec("formatBlock", "<h1>")}>
          H1
        </button>
        <button title="H2" style={styles.toolBtn} onClick={() => exec("formatBlock", "<h2>")}>
          H2
        </button>
        <button title="Bullet List" style={styles.toolBtn} onClick={() => exec("insertUnorderedList")}>
          ••
        </button>
        <button title="Numbered List" style={styles.toolBtn} onClick={() => exec("insertOrderedList")}>
          1.
        </button>
        <button title="Quote" style={styles.toolBtn} onClick={() => exec("formatBlock", "<blockquote>")}>
          “”
        </button>
        <button title="Code" style={styles.toolBtn} onClick={() => exec("formatBlock", "<pre>")}>
          {"</>"}
        </button>
      </div>
      <div
        ref={ref}
        contentEditable
        onInput={handleInput}
        style={styles.editor}
        data-placeholder="Write your note..."
        suppressContentEditableWarning
      />
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: {
    border: `1px solid ${theme.colors.border}`,
    borderRadius: theme.radius.lg,
    overflow: "hidden",
    background: theme.colors.bg,
    boxShadow: theme.shadow.sm,
  },
  toolbar: {
    display: "flex",
    gap: 8,
    padding: 8,
    borderBottom: `1px solid ${theme.colors.border}`,
    background: theme.colors.subtle,
  },
  toolBtn: {
    border: `1px solid ${theme.colors.border}`,
    background: "white",
    padding: "6px 10px",
    borderRadius: theme.radius.sm,
    cursor: "pointer",
    fontWeight: 600,
  },
  editor: {
    minHeight: 240,
    padding: 16,
    outline: "none",
  },
};
