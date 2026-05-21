import { Card, CardContent } from "@mui/material";

interface AudioPlayerCardProps {
  audioUrl: string;
}

export default function AudioPlayerCard({ audioUrl }: AudioPlayerCardProps) {
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
        <audio controls src={audioUrl} style={{ width: "100%" }} />
      </CardContent>
    </Card>
  );
}
