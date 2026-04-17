import { Box, IconButton, Typography } from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";

interface TopBarProps {
  onLogout: () => void;
}

export default function TopBar({ onLogout }: TopBarProps) {
  return (
    <Box
      sx={{
        height: 64,
        px: 3,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        background: "#033b4a",
        color: "#fff",
      }}
    >
      <Typography variant="h6">AlphaSound</Typography>
      <IconButton onClick={onLogout} color="inherit">
        <LogoutIcon />
      </IconButton>
    </Box>
  );
}
