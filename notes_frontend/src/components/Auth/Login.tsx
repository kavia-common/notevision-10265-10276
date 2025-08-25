import React, { useState } from "react";
import { theme } from "../../theme";
import { login } from "../../utils/api";

type Props = {
  onSuccess: () => void;
};

export const Login: React.FC<Props> = ({ onSuccess }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!email || !password) {
      setError("Please provide email and password.");
      return;
    }
    setBusy(true);
    const res = await login(email, password);
    setBusy(false);
    if (res.error) {
      setError(res.error);
    } else {
      onSuccess();
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>NoteVision</h1>
        <p style={styles.subtitle}>Sign in to continue</p>
        <form onSubmit={submit} style={styles.form}>
          <label style={styles.label}>Email</label>
          <input
            style={styles.input}
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <label style={styles.label}>Password</label>
          <input
            style={styles.input}
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {error && <div style={styles.error}>{error}</div>}
          <button type="submit" disabled={busy} style={styles.button}>
            {busy ? "Signing in..." : "Sign in"}
          </button>
        </form>
        <p style={styles.hint}>Use your project account to log in.</p>
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: {
    minHeight: "100vh",
    display: "grid",
    placeItems: "center",
    background: theme.colors.subtle,
    padding: 24,
  },
  card: {
    width: "100%",
    maxWidth: 420,
    background: theme.colors.bg,
    borderRadius: theme.radius.lg,
    boxShadow: theme.shadow.lg,
    padding: 28,
  },
  title: {
    margin: 0,
    fontSize: 28,
    color: theme.colors.text,
  },
  subtitle: {
    marginTop: 8,
    marginBottom: 24,
    color: theme.colors.mutedText,
  },
  form: {
    display: "grid",
    gap: 12,
  },
  label: {
    fontSize: 14,
    color: theme.colors.mutedText,
  },
  input: {
    padding: "12px 14px",
    border: `1px solid ${theme.colors.border}`,
    borderRadius: theme.radius.md,
    outline: "none",
    fontSize: 14,
  },
  error: {
    color: theme.colors.accent,
    fontSize: 14,
    marginTop: 6,
  },
  button: {
    marginTop: 8,
    padding: "12px 14px",
    background: theme.colors.primary,
    color: "white",
    border: "none",
    borderRadius: theme.radius.md,
    cursor: "pointer",
    fontWeight: 600,
  },
  hint: {
    marginTop: 16,
    textAlign: "center",
    color: theme.colors.mutedText,
    fontSize: 12,
  },
};
