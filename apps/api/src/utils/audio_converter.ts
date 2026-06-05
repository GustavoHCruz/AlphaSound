import ffmpeg from 'fluent-ffmpeg';
import { promises as fs } from 'fs';
import { join, parse } from 'path';

export async function convertToMp3(inputPath: string): Promise<string> {
  const parsed = parse(inputPath);

  const outputPath = join(parsed.dir, `${parsed.name}.mp3`);

  return new Promise((resolve, reject) => {
    ffmpeg(inputPath)
      .audioCodec('libmp3lame')
      .audioBitrate('192k')
      .format('mp3')
      .save(outputPath)
      .on('end', async () => {
        if (inputPath !== outputPath) {
          await fs.unlink(inputPath);
        }

        resolve(outputPath);
      })
      .on('error', reject);
  });
}
