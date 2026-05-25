import { gradients } from "@/src/theme/gradients";
import { palette } from "@/src/theme/palette";

export const sidebarStyle = {
	background: gradients.sidebar,
  color: palette.text.inverted,
  height: "100vh",
  display: "flex",
  flexDirection: "column",
  flexShrink: 0
};

export const sidebarScrollAreaStyle = {
  flex: 1,
  overflowY: "auto",
  overflowX: "hidden",
  pb: 2,
  "&::-webkit-scrollbar": {
    width: 8,
  },
  "&::-webkit-scrollbar-track": {
    background: "transparent",
  },
  "&::-webkit-scrollbar-thumb": {
    background: "rgba(255,255,255,0.18)",
    borderRadius: 999,
  },
  "&::-webkit-scrollbar-thumb:hover": {
    background: "rgba(255,255,255,0.28)",
  },
};

export const sidebarItemStyle = (selected: boolean) => ({
  borderRadius: 2,
  mx: 1,
  mb: 0.5,
  transition: "all .15s ease",
  backgroundColor: selected ? "rgba(255,255,255,0.12)" : "transparent",
  "&:hover": {
    backgroundColor: selected
      ? "rgba(255,255,255,0.16)"
      : "rgba(255,255,255,0.08)",
  },
});

export const sidebarEditButtonStyle = {
  color: palette.text.invertedSecondary,
  p: 0.5,
};

export const sidebarSessionTextStyle = {
  flex: 1,
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
  fontSize: 14,
  fontWeight: 500,
  color: palette.text.inverted,
};

export const sidebarSessionInputStyle = {
  color: palette.text.inverted,
  fontSize: 14,
  fontWeight: 500,
};
