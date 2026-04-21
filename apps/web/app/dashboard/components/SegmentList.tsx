import { Card, CardContent, Chip, Typography } from "@mui/material";
import { Segment } from "../page";

interface SegmentListProps {
  segments: Segment[];
}

export default function SegmentList({ segments }: SegmentListProps) {
  return (
    <>
      {segments.map((s) => (
        <Card key={s.id} sx={{ mb: 2 }}>
          <CardContent>
            <Chip label={`Start: ${s.start}`} />
            <Chip label={`End: ${s.end}`} />
            <Typography>{s.text}</Typography>
            <Typography color="text.secondary">{s.transcription}</Typography>
          </CardContent>
        </Card>
      ))}
    </>
  );
}
