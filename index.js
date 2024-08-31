import { readJsonFile } from "./src/utils.js";
import { Tournament } from "./src/Tournament.js";
import { Game } from "./src/Game.js";

// Main function to process and print data
async function main() {
  try {
    // Read and parse the JSON file
    const groupsData = await readJsonFile("groups.json");
    const exibitionsData = await readJsonFile("exibitions.json");

    // Create Tournament instance
    const tournament = new Tournament(groupsData, exibitionsData);

    //tournament.printAllInfo();
    tournament.simulateGroupStage();
    tournament.drawKnockoutStage();
    tournament.simulateKnockoutStage();
  } catch (error) {
    console.error("An error occurred during tournament simulation:");
    console.error("Error message:", error.message);
    console.error("Error stack:", error.stack);

    if (error instanceof TypeError) {
      console.error("This error might be due to incorrect data types.");
    } else if (error instanceof SyntaxError) {
      console.error(
        "This error might be due to invalid JSON in the input files."
      );
    } else if (error instanceof ReferenceError) {
      console.error(
        "This error might be due to accessing undefined variables or functions."
      );
    }
  }
}

// Run the main function
main();
