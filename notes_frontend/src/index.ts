import "./styles.css";
import { registerRoot } from "remotion";
import { RemotionRoot } from "./Root";

// This is your entry file! Refer to it when you render:
// npx remotion render <entry-file> HelloWorld out/video.mp4

registerRoot(RemotionRoot);
