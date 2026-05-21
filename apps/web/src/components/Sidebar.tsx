import { AudioSession } from "@/src/types/audio-session";
import { formatDate } from "@/src/utils/format";
import AudioFileIcon from "@mui/icons-material/AudioFile";
import EditIcon from "@mui/icons-material/Edit";
import MenuIcon from "@mui/icons-material/Menu";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import {
  Box,
  Divider,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  TextField,
  Toolbar,
  Typography,
} from "@mui/material";
import { useState } from "react";

interface SidebarProps {
  menuOpen: boolean;
  setMenuOpen: (open: boolean) => void;
  sessions: AudioSession[];
  selectedSessionId: string | null;
  onSelectSession: (id: string) => void;
  onNewSession: () => void;
  onRename: (sessionId: string, name: string) => void;
}

export default function Sidebar({
  menuOpen,
  setMenuOpen,
  sessions,
  selectedSessionId,
  onSelectSession,
  onNewSession,
  onRename,
}: SidebarProps) {
  const [editingSessionId, setEditingSessionId] = useState<string | null>(null);

  return (
    <Box
      component="aside"
      sx={{
        width: {
          xs: 82,
          sm: menuOpen ? 260 : 82,
        },
        transition: "width .2s ease",
        background:
          "linear-gradient(180deg,rgb(4, 76, 92) 0%,rgb(5, 43, 58) 100%)",
        color: "#f7f9ff",
        minHeight: "100vh",
      }}
    >
      <Toolbar>
        <IconButton onClick={() => setMenuOpen(!menuOpen)} color="inherit">
          <MenuIcon />
        </IconButton>
        {menuOpen && <Typography sx={{ ml: 1 }}>Sessions</Typography>}
      </Toolbar>
      <List>
        <ListItemButton onClick={onNewSession}>
          <ListItemIcon sx={{ color: "inherit" }}>
            <UploadFileIcon />
          </ListItemIcon>
          {menuOpen && <ListItemText primary="New Session" />}
        </ListItemButton>
        <Divider sx={{ my: 1 }} />
        {sessions.map((session) => (
          <ListItemButton
            key={session.id}
            selected={selectedSessionId === session.id}
            onClick={() => onSelectSession(session.id)}
          >
            <ListItemIcon sx={{ color: "inherit" }}>
              <AudioFileIcon />
            </ListItemIcon>
            {menuOpen && (
              <ListItemText
                primary={
                  editingSessionId === session.id ? (
                    <TextField
                      autoFocus
                      variant="standard"
                      value={session.name}
                      onChange={(e) => onRename(session.id, e.target.value)}
                      onBlur={() => setEditingSessionId(null)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          setEditingSessionId(null);
                        }

                        if (e.key === "Escape") {
                          setEditingSessionId(null);
                        }
                      }}
                      fullWidth
                      slotProps={{
                        input: {
                          disableUnderline: true,
                          sx: {
                            color: "#ffffff",
                            fontSize: 14,
                            fontWeight: 500,
                          },
                        },
                      }}
                    />
                  ) : (
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                      }}
                    >
                      <Typography
                        sx={{
                          flex: 1,
                          fontSize: 14,
                          fontWeight: 500,
                          color: "#ffffff",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {session.name}
                      </Typography>

                      <IconButton
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingSessionId(session.id);
                        }}
                        sx={{
                          color: "rgba(255,255,255,0.7)",
                          p: 0.5,
                        }}
                      >
                        <EditIcon fontSize="inherit" />
                      </IconButton>
                    </Box>
                  )
                }
                secondary={
                  <Typography
                    variant="caption"
                    sx={{
                      color: "rgba(255,255,255,0.7)",
                    }}
                  >
                    {formatDate(session.createdAt)}
                  </Typography>
                }
              />
            )}
          </ListItemButton>
        ))}
      </List>
    </Box>
  );
}
