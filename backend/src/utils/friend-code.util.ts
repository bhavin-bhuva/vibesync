export function generateFriendCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const segments = 3;
  const segmentLength = 5; // Changed from 4 to 5

  const code = Array.from({ length: segments }, () => {
    return Array.from({ length: segmentLength }, () => {
      return chars.charAt(Math.floor(Math.random() * chars.length));
    }).join('');
  }).join('-');

  return code; // Format: XXXXX-XXXXX-XXXXX (17 characters: 5+5+5+2 dashes)
}
