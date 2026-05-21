export function isValidMp3(file: File) {
  return file.type === "audio/mpeg" || file.name.toLowerCase().endsWith(".mp3");
}
