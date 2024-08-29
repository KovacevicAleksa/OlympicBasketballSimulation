import { readJsonFile } from "./src/utils.js";
import { Tournament } from "./src/Tournament.js";
import { Game } from "./src/Game.js";

// Main function to process and print data
async function main() {
  try {
    // Read and parse the JSON file
    const groupsData = await readJsonFile("groups.json");

    // Create Tournament instance
    const tournament = new Tournament(groupsData);

    tournament.simulateGroupStage();
    tournament.drawKnockoutStage();
    tournament.simulateKnockoutStage();
  } catch (error) {
    console.error("Error:", error.message);
  }
}

// Run the main function
main();
