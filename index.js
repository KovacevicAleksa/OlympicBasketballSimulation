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

    // Print group and team information
    tournament.groups.forEach((group) => {
      console.log(`Group: ${group.name}`);
      group.teams.forEach((team) => {
        console.log(
          `- Team: ${team.name}, ISO Code: ${team.isoCode}, FIBA Ranking: ${team.fibaRanking}`
        );
      });
      console.log("--------------------------------");
    });

    // Example usage of Game
    const team1 = tournament.groups[0].teams[0];
    const team2 = tournament.groups[0].teams[1];
    const game = new Game(team1, team2);
    game.play();
    console.log(
      `Game Result: ${team1.name} ${game.score1} - ${game.score2} ${team2.name}`
    );
  } catch (error) {
    console.error("Error:", error.message);
  }
}

// Run the main function
main();
