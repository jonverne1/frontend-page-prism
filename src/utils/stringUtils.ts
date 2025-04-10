/**
 * Takes a string as input, then truncates it, then adds an ellipsis if it's longer than the max length
 * @param string - input string to truncate
 * @param maxLength - max length of the string
 * @returns A truncated string with an ellipsis if it's greater than maxLength
 */
export const truncateString = (string: string, maxLength: number): string => {
  if (string.length <= maxLength) return string;
  return string.slice(0, maxLength - 1) + '…';
};