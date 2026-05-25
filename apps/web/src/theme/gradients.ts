import { palette } from "./palette";

export const gradients = {
  sidebar: `
    linear-gradient(
      180deg,
      ${palette.sidebar.top} 0%,
      ${palette.sidebar.bottom} 100%
    )
  `,
  loginBackground: `
    radial-gradient(
      circle at 20% 20%,
      rgb(203, 220, 222) 0%,
      rgb(42, 105, 144) 25%,
      rgb(11, 34, 77) 75%
    )
  `,
  primaryButton: `
    linear-gradient(
      120deg,
      rgba(8,34,82,1) 0%,
      rgba(27,112,196,1) 100%
    )
  `,
  card: `
    linear-gradient(
      to bottom,
      #fbfdff,
      #f7fbff
    )
  `,
};
