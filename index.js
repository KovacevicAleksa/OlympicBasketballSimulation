import { Team } from "./src/Team.js";
import { Group } from "./src/Group.js";
import { readJsonFile, getRandomScore, shuffle } from "./src/utils.js";

//Process and print data
async function main() {
  try {
    // Read and parse the JSON file
    const groupsData = await readJsonFile("groups.json");

    // Process and print data
    Object.entries(groupsData).forEach(([groupName, teamDataArray]) => {
      // Create Team instances for each team in the group
      const teams = teamDataArray.map(
        ({ Team: teamName, ISOCode, FIBARanking }) =>
          new Team(teamName, ISOCode, FIBARanking)
      );

      // Create a Group instance
      const group = new Group(groupName, teams);

      // Print group and team information
      console.log(`Group: ${group.name}`);
      group.teams.forEach((team) => {
        console.log(
          `- Team: ${team.name}, ISO Code: ${team.isoCode}, FIBA Ranking: ${team.fibaRanking}`
        );
      });
      console.log("--------------------------------");
    });
  } catch (error) {
    console.error(error.message);
  }
}

//Tests
//console.log(`${getRandomScore(true, 10)} vs ${getRandomScore(false, 0)}`);
//console.log(shuffle([1, 2, 3, 4, 5]));

// Run the main function
main();
