import {
  sidebarEditButtonStyle,
  sidebarItemStyle,
  sidebarScrollAreaStyle,
  sidebarSessionInputStyle,
  sidebarSessionTextStyle,
  sidebarStyle,
} from "@/src/styles/sidebar";
import { palette } from "@/src/theme/palette";
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
        ...sidebarStyle,
        width: {
          xs: 82,
          sm: menuOpen ? 260 : 82,
        },
        transition: "width .2s ease",
      }}
    >
      <Toolbar>
        <IconButton onClick={() => setMenuOpen(!menuOpen)} color="inherit">
          <MenuIcon />
        </IconButton>
        {menuOpen && <Typography sx={{ ml: 1 }}>Sessions</Typography>}
      </Toolbar>
      <Box sx={sidebarScrollAreaStyle}>
        <List>
          <ListItemButton onClick={onNewSession} sx={sidebarItemStyle(false)}>
            <ListItemIcon sx={{ color: palette.text.inverted }}>
              <UploadFileIcon />
            </ListItemIcon>
            {menuOpen && <ListItemText primary="New Session" />}
          </ListItemButton>

          <Divider sx={{ my: 1, borderColor: "rgba(255,255,255,0.08)" }} />

          {sessions.map((session) => {
            const selected = selectedSessionId === session.id;
            return (
              <ListItemButton
                key={session.id}
                selected={selected}
                onClick={() => onSelectSession(session.id)}
                sx={sidebarItemStyle(selected)}
              >
                <ListItemIcon sx={{ color: palette.text.inverted }}>
                  <AudioFileIcon />
                </ListItemIcon>

                {menuOpen && (
                  <ListItemText
                    primary={
                      editingSessionId === session.id && selected ? (
                        <TextField
                          autoFocus
                          variant="standard"
                          value={session.name}
                          onChange={(e) => onRename(session.id, e.target.value)}
                          onClick={(e) => e.stopPropagation()}
                          onBlur={() => setEditingSessionId(null)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === "Escape") {
                              setEditingSessionId(null);
                            }
                          }}
                          slotProps={{
                            input: {
                              disableUnderline: true,
                              sx: sidebarSessionInputStyle,
                            },
                          }}
                        />
                      ) : (
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 1 }}
                        >
                          <Typography sx={sidebarSessionTextStyle}>
                            {session.name}
                          </Typography>

                          {selected && (
                            <IconButton
                              size="small"
                              onClick={(e) => {
                                e.stopPropagation();
                                setEditingSessionId(session.id);
                              }}
                              sx={sidebarEditButtonStyle}
                            >
                              <EditIcon fontSize="inherit" />
                            </IconButton>
                          )}
                        </Box>
                      )
                    }
                    secondary={
                      <Typography
                        variant="caption"
                        sx={{ color: palette.text.invertedSecondary }}
                      >
                        {formatDate(session.createdAt)}
                      </Typography>
                    }
                  />
                )}
              </ListItemButton>
            );
          })}
        </List>
      </Box>
    </Box>
  );
}
