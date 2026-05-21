import SegmentCard from "./SegmentCard";

import { AudioSegment } from "@/src/types/audio-session";

interface SegmentListProps {
  segments: AudioSegment[];

  onUpdate: (segmentId: string, text: string) => void;
}

export default function SegmentList({ segments, onUpdate }: SegmentListProps) {
  return (
    <>
      {segments.map((segment) => (
        <SegmentCard key={segment.id} segment={segment} onUpdate={onUpdate} />
      ))}
    </>
  );
}
