import { AudioSegment } from "@/src/types/audio-session";
import {
  Card,
  CardContent,
  Chip,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

interface SegmentCardProps {
  segment: AudioSegment;
  onUpdate: (segmentId: string, text: string) => void;
}

export default function SegmentCard({ segment, onUpdate }: SegmentCardProps) {
  const audioUrl = segment.audioBase64
    ? `data:audio/mp3;base64,${segment.audioBase64}`
    : "";

  return (
    <Card
      sx={{
        mb: 2,
        borderRadius: 3,
        border: "1px solid #d6e9ff",
        background: "linear-gradient(to bottom, #fbfdff, #f7fbff)",
        boxShadow: "0 2px 6px rgba(30,64,175,0.05)",
        transition: "all 0.2s ease",
        "&:hover": {
          borderColor: "#bfdbfe",
          boxShadow: "0 4px 10px rgba(30,64,175,0.08)",
        },
      }}
    >
      <CardContent>
        <Stack direction="row" spacing={1} sx={{ mb: 2, alignItems: "center" }}>
          <Chip label={`Start: ${segment.start}`} />

          <Chip label={`End: ${segment.end}`} />

          {audioUrl && (
            <audio
              controls
              src={audioUrl}
              style={{
                height: 32,
                flex: 1,
              }}
            />
          )}
        </Stack>

        <TextField
          fullWidth
          multiline
          minRows={1}
          label="Notes..."
          value={segment.text}
          onChange={(e) => onUpdate(segment.id, e.target.value)}
          sx={{ mt: 2 }}
        />

        <Typography color="text.secondary" sx={{ mt: 2 }}>
          {segment.transcription}
        </Typography>
      </CardContent>
    </Card>
  );
}
