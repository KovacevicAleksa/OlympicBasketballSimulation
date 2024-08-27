import { readFile } from "node:fs/promises";

// Reads a JSON file asynchronously and parses its content.
export async function readJsonFile(filename) {
  try {
    const data = await readFile(filename, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    if (error.code === "ENOENT") {
      throw new Error(`File not found: ${filename}`);
    } else if (error.code === "EACCES") {
      throw new Error(`Permission denied: ${filename}`);
    } else {
      throw new Error(
        `Error reading or parsing the file ${filename}: ${error.message}`
      );
    }
  }
}

// Generates a random basketball score between 70 and 99, adding a bonus if the team is favored based on ranking difference.
export function getRandomScore(isFavored, rankDiff) {
  const baseScore = 70 + Math.floor(Math.random() * 30);
  const bonus = isFavored ? Math.floor(rankDiff / 2) : 0;
  return baseScore + bonus;
}

//Shuffles the elements of an array in place using the Fisher-Yates algorithm.
export function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    // Generate a random index from 0 to i
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}
