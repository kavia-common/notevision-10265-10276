export const theme = {
  colors: {
    primary: "#3366FF",
    secondary: "#FFAA00",
    accent: "#FF3366",
    bg: "#FFFFFF",
    text: "#1A1A1A",
    subtle: "#F5F7FB",
    border: "#E5EAF2",
    mutedText: "#6B7280",
  },
  radius: {
    sm: 6,
    md: 10,
    lg: 16,
    xl: 20,
  },
  shadow: {
    sm: "0 1px 2px rgba(0,0,0,0.04)",
    md: "0 4px 12px rgba(0,0,0,0.07)",
    lg: "0 12px 24px rgba(0,0,0,0.08)",
  },
};

export type Theme = typeof theme;
