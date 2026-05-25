export const components = {
  MuiCard: {
    styleOverrides: {
      root: {
        borderRadius: 16,
      },
    },
  },

  MuiButton: {
    styleOverrides: {
      root: {
        textTransform: "none",
        borderRadius: 10,
        fontWeight: 700,
      },
    },
  },

  MuiTextField: {
    defaultProps: {
      variant: "outlined" as const,
      fullWidth: true,
    },
  },
};
