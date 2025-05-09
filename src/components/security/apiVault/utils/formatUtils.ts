
// Format key display
export const maskKey = (key: string) => {
  if (key.length <= 8) return "•".repeat(key.length);
  return `${key.substring(0, 4)}${"•".repeat(key.length - 8)}${key.substring(key.length - 4)}`;
};

// Select service icon
export const getServiceIcon = (service: string) => {
  switch (service) {
    case 'supabase':
      return '🔷';
    case 'vercel':
      return '▲';
    case 'solana':
      return '◎';
    case 'aws':
      return '☁️';
    case 'github':
      return '🐙';
    case 'stripe':
      return '💳';
    case 'openai':
      return '🤖';
    case 'firebase':
      return '🔥';
    default:
      return '🔑';
  }
};
