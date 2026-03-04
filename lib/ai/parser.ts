import type { ParsedSegment } from '@/lib/types';

export function parseAIResponse(response: string): ParsedSegment[] {
  const segments: ParsedSegment[] = [];
  const jsonBlockRegex = /```json\s*\n([\s\S]*?)```/g;

  let lastIndex = 0;
  let match;

  while ((match = jsonBlockRegex.exec(response)) !== null) {
    if (match.index > lastIndex) {
      const text = response.slice(lastIndex, match.index).trim();
      if (text) segments.push({ type: 'text', content: text });
    }

    try {
      const parsed = JSON.parse(match[1]);
      segments.push({
        type: 'json_block',
        content: match[1],
        data: parsed,
        blockType: parsed.type || 'unknown',
      });
    } catch {
      segments.push({ type: 'text', content: match[0] });
    }

    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < response.length) {
    const text = response.slice(lastIndex).trim();
    if (text) segments.push({ type: 'text', content: text });
  }

  return segments;
}
