import { shadows } from "@/src/theme/shadows";

export const glassPanelStyle = {
  background: "rgba(255,255,255,0.96)",
  backdropFilter: "blur(8px)",
  borderRadius: 5,
  boxShadow: shadows.panel,
};

export const pageContainerStyle = {
  width: "100%",
  maxWidth: 900,
  margin: "0 auto",
  padding: 3,
};
