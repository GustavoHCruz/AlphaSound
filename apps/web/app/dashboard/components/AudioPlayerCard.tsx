import { Button, Card, CardContent } from "@mui/material";

interface AudioPlayerCardProps {
  audioUrl: string;
  onNewUpload: () => void;
}

export default function AudioPlayerCard({ audioUrl, onNewUpload }: AudioPlayerCardProps) {
  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <audio controls src={audioUrl} style={{ width: "100%" }} />
        <Button onClick={onNewUpload}>Novo upload</Button>
      </CardContent>
    </Card>
  );
}
