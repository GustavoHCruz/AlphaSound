export function base64ToAudioUrl(base64: string, mime = "audio/mpeg") {
  const cleaned = base64.replace(/^data:audio\/\w+;base64,/, "");

  const byteCharacters = atob(cleaned);

  const byteNumbers = new Array(byteCharacters.length);

  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }

  const byteArray = new Uint8Array(byteNumbers);

  const blob = new Blob([byteArray], {
    type: mime,
  });

  return URL.createObjectURL(blob);
}
