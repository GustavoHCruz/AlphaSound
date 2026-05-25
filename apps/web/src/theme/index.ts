import { createTheme } from "@mui/material/styles";

import { components } from "./components";
import { typography } from "./typography";

export const theme = createTheme({
  typography: {
    fontFamily: typography.fontFamily,
    h5: typography.h5,
  },

  components,
});
