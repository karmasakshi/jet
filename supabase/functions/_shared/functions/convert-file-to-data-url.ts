import { Buffer } from 'node:buffer';

export async function convertFileToDataUrl(file: File): Promise<string> {
  const buffer: ArrayBuffer = await file.arrayBuffer();
  const base64: string = Buffer.from(buffer).toString('base64');

  return `data:${file.type};base64,${base64}`;
}
