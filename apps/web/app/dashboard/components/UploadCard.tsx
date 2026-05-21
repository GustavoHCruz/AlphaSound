import UploadFileIcon from "@mui/icons-material/UploadFile";
import { Alert, Box, Button, Card, CardContent, CircularProgress, Stack, Typography } from "@mui/material";
import { ChangeEvent, DragEvent, RefObject } from "react";

interface UploadCardProps {
  uploading: boolean;
  dragActive: boolean;
  onDrop: (event: DragEvent<HTMLDivElement>) => void;
  onDragOver: (event: DragEvent<HTMLDivElement>) => void;
  onDragLeave: (event: DragEvent<HTMLDivElement>) => void;
  onUpload: (event: ChangeEvent<HTMLInputElement>) => void;
  fileInputRef: RefObject<HTMLInputElement | null>;
  error: string;
}

export default function UploadCard({
  uploading,
  dragActive,
  onDrop,
  onDragOver,
  onDragLeave,
  onUpload,
  fileInputRef,
  error,
}: UploadCardProps) {
  return (
    <Card>
      <CardContent>
        <Box
          onDrop={onDrop}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onClick={() => fileInputRef.current?.click()}
          sx={{
            border: dragActive ? "2px solid #1c77d9" : "2px dashed #9cb4d8",
            background: dragActive ? "#edf5ff" : "#f9fbff",
            borderRadius: 3,
            p: { xs: 3, sm: 5 },
            textAlign: "center",
            cursor: "pointer",
            transition: "all .2s ease",
          }}
        >
          <Stack spacing={1.5} sx={{ alignItems: "center" }}>
            <UploadFileIcon sx={{ fontSize: 42, color: "#1c77d9" }} />
            <Typography sx={{ fontWeight: 700 }}>
              {dragActive ? "Drop file here" : "Drag and drop to upload"}
            </Typography>
            <Typography color="text.secondary">or click to select</Typography>
            <Button
              variant="contained"
              startIcon={uploading ? <CircularProgress size={18} /> : <UploadFileIcon />}
              disabled={uploading}
              sx={{ textTransform: "none", fontWeight: 700 }}
            >
              {uploading ? "Uploading..." : "Select File"}
            </Button>
          </Stack>
        </Box>
        <input
          hidden
          ref={fileInputRef}
          type="file"
          accept=".mp3,audio/mpeg"
          onChange={onUpload}
        />
        {error && <Alert severity="error">{error}</Alert>}
      </CardContent>
    </Card>
  );
}
