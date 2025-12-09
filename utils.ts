import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Simple scoring based fuzzy search
// 1. Exact match (case insensitive) -> High score
// 2. Starts with -> Medium score
// 3. Contains all words -> Low score
// 4. Contains some characters in order (loose) -> Lowest acceptable score
export function fuzzyMatch(query: string, target: string): boolean {
  if (!query) return true;
  const q = query.toLowerCase().trim();
  const t = target.toLowerCase();

  // Direct include
  if (t.includes(q)) return true;

  // Split query into words and check if all words exist in target
  const words = q.split(/\s+/);
  const allWordsFound = words.every(word => t.includes(word));
  if (allWordsFound) return true;

  // Simple "close enough" check: Allow for 1 character mistake if length > 4? 
  // Or just check if 70% of characters match in order. 
  // For this inventory use case, "contains" is usually the most robust "close enough".
  // Let's implement a very basic subsequence check for "close enough" typing
  let queryIdx = 0;
  let targetIdx = 0;
  while (queryIdx < q.length && targetIdx < t.length) {
    if (q[queryIdx] === t[targetIdx]) {
      queryIdx++;
    }
    targetIdx++;
  }
  
  // If we matched the whole query string as a subsequence
  return queryIdx === q.length;
}