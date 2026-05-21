import { Card, CardContent } from "@mui/material";

interface AudioPlayerCardProps {
  audioUrl: string;
}

export default function AudioPlayerCard({ audioUrl }: AudioPlayerCardProps) {
  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <audio controls src={audioUrl} style={{ width: "100%" }} />
      </CardContent>
    </Card>
  );
}
