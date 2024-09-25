import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export async function sleep(ms: number) {
  await new Promise(resolve => setTimeout(resolve, ms))
}

export async function fetchSpecificGithubEmoji(emojiName: string):
  Promise<string | null> {

  try {
    const response = await fetch('https://api.github.com/emojis');
    const allEmojis = await response.json();

    const emoji = allEmojis[emojiName];

    if (emoji) {
      return emoji as string;
    } else {
      console.error(`Emoji "${emojiName}" not found`);
      return null;  // Return null if the emoji is not found
    }
  } catch (error) {
    console.error('Error fetching emoji:', error);
    return null;
  }
};