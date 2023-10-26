/**
 * Splits a string into segments of specified lengths.
 *
 * @param input - The input string to split into segments.
 * @param lengths - The lengths of the segments to extract, in bytes.
 * @returns An array containing the extracted segments in the order they were specified.
 *
 * @example
 * const bytecode = "0x1234567890abcdef1234567890abcdef1234567890abcdef";
 * const segments = segmentBytecode(bytecode, 2, 4, 8);
 * console.log(segments); // ["0x", "1234", "567890ab"]
 */
export function segmentBytecode(input: string, ...lengths: number[]): string[] {
  let position = 0
  const segments: string[] = []
  const cleanInput = input.startsWith('0x') ? input.substring(2) : input // Remove "0x" prefix if present

  for (const length of lengths) {
    segments.push(cleanInput.substr(position, length * 2))
    position += length * 2
  }

  return segments
}
