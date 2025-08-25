import React, { useMemo } from "react";
import {
  AbsoluteFill,
  Sequence,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

/**
 * PUBLIC_INTERFACE
 * NoteVideoComposition
 * A Remotion composition that renders a note's title and HTML body.
 * Props:
 *  - title: string - Note title
 *  - html: string - Note body HTML (should be sanitized by backend)
 * Returns: A full-screen animated frame sequence suitable for rendering to video.
 */
type Props = {
  title: string;
  html: string;
};

const bg = "#0B1020";
const fg = "#FFFFFF";

export const NoteVideoComposition: React.FC<Props> = ({ title, html }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  const introOpacity = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp" });
  const outroOpacity = interpolate(
    frame,
    [durationInFrames - 20, durationInFrames],
    [1, 0],
    { extrapolateLeft: "clamp" }
  );

  const sanitizedHtml = useMemo(() => {
    // Keep it simple; backend should sanitize. For display, basic pass-through.
    return html || "<p><i>No content</i></p>";
  }, [html]);

  return (
    <AbsoluteFill style={{ background: bg, color: fg, fontFamily: "Inter, system-ui, sans-serif" }}>
      <AbsoluteFill style={{ padding: 60, opacity: introOpacity * outroOpacity }}>
        <Sequence from={0}>
          <h1 style={{ margin: 0, fontSize: 64, lineHeight: 1.1 }}>{title || "Untitled"}</h1>
        </Sequence>
        <Sequence from={15}>
          <div
            style={{
              marginTop: 24,
              fontSize: 28,
              lineHeight: 1.5,
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
              padding: 24,
              borderRadius: 16,
            }}
            dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
          />
        </Sequence>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
