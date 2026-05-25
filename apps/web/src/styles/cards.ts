import { gradients } from "@/src/theme/gradients";
import { palette } from "@/src/theme/palette";
import { shadows } from "@/src/theme/shadows";

export const softCardStyle = {
  borderRadius: 3,
  border: `1px solid ${palette.border.light}`,
  background: gradients.card,
  boxShadow: shadows.card,
  transition: "all 0.2s ease",

  "&:hover": {
    borderColor: palette.border.hover,
    boxShadow: shadows.cardHover,
  },
};
