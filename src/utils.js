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
