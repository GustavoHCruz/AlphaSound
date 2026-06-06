export function isValidAudio(file: File) {
  if (!file.type) {
    return false;
  }

  return file.type.startsWith("audio/") || file.type.startsWith("video/");
}
