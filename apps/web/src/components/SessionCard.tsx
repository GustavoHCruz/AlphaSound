import { AudioSession } from "@/src/types/audio-session";
import { Card, CardContent, Stack, TextField, Typography } from "@mui/material";

interface SessionCardProps {
  session: AudioSession;

  onRename: (sessionId: string, name: string) => void;

  onSelect: (sessionId: string) => void;

  selected?: boolean;
}

export default function SessionCard({
  session,
  onRename,
  onSelect,
  selected = false,
}: SessionCardProps) {
  return (
    <Card
      onClick={() => onSelect(session.id)}
      sx={{
        mb: 1,
        cursor: "pointer",
        border: selected ? "2px solid #1976d2" : "1px solid transparent",
      }}
    >
      <CardContent>
        <Stack spacing={2}>
          <TextField
            fullWidth
            size="small"
            label="Session Name"
            value={session.name}
            onChange={(e) => onRename(session.id, e.target.value)}
            onClick={(e) => e.stopPropagation()}
          />

          <Typography variant="body2" color="text.secondary">
            {session.status}
          </Typography>
        </Stack>
      </CardContent>
    </Card>
  );
}
