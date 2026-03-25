import { customAlphabet } from 'nanoid';

/**
 * Generate a unique tracking ID in format: GUL-XXXX-XXXX
 * Uses alphanumeric characters excluding confusing ones (0, O, I, l, 1)
 */
export function generateTrackingId(): string {
  // Alphabet without confusing characters
  const alphabet = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';

  // Create custom nanoid with our alphabet
  const nanoid = customAlphabet(alphabet, 8);

  // Generate 8 random characters
  const randomPart = nanoid();

  // Format: GUL-XXXX-XXXX
  const part1 = randomPart.substring(0, 4);
  const part2 = randomPart.substring(4, 8);

  return `GUL-${part1}-${part2}`;
}

/**
 * Validate tracking ID format
 */
export function isValidTrackingId(trackingId: string): boolean {
  const regex = /^GUL-[A-Z2-9]{4}-[A-Z2-9]{4}$/;
  return regex.test(trackingId);
}
