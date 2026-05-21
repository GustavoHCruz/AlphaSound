export interface AudioSegment {
  id: string;
  start: number;
  end: number;
  text: string;
  transcription: string;
  sessionId: string;
  audioBase64?: string | null;
}

export interface AudioSession {
  id: string;
  name: string;
  createdAt: string;
  audioPath?: string;
  audioBase64?: string | null;
  status?: string;
  segments: AudioSegment[];
}
