import { Group } from "./Group.js";
import { Team } from "./Team.js";
import { shuffle } from "./utils.js";

export class Tournament {
  constructor(groupsData) {
    // Initialize groups based on provided group data
    this.groups = Object.entries(groupsData).map(
      ([name, teams]) =>
        new Group(
          name,
          teams.map((t) => new Team(t.Team, t.ISOCode, t.FIBARanking))
        )
    );
    this.qualifiedTeams = []; // Array to hold teams qualified for knockout stage
    this.knockoutGames = {
      quarterfinals: [], // Array to store quarterfinal games
      semifinals: [], // Array to store semifinal games
    };
  }

  // Simulate the group stage of the tournament
  simulateGroupStage() {
    console.log("Group Stage:");
    this.groups.forEach((group) => {
      console.log(`\nGroup ${group.name}:`);
      group.playGames(); // Simulate all games in the group
      group.games.forEach((game) => console.log(game.toString())); // Print each game's result
      group.rankTeams(); // Rank teams based on the results
    });

    this.displayGroupStandings(); // Display the standings after the group stage
    this.determineQualifiedTeams(); // Determine which teams advance to the knockout stage
  }

  // Display the final standings for each group
  displayGroupStandings() {
    console.log("\nKonačan plasman u grupama:");
    this.groups.forEach((group) => {
      console.log(
        `\nGroup ${group.name} (Ime - pobede/porazi/bodovi/postignuti koševi/primljeni koševi/koš razlika):`
      );
      group.teams.forEach((team, index) => {
        console.log(
          `${index + 1}. ${team.name.padEnd(12)} ${team.wins} / ${
            team.losses
          } / ${team.points} / ${team.pointsScored} / ${
            team.pointsConceded
          } / ${team.pointDifference > 0 ? "+" : ""}${team.pointDifference}`
        );
      });
    });
  }

  // Determine which teams qualify for the knockout stage
  determineQualifiedTeams() {
    // Flatten the list of teams and add their ranking within the group
    const allRanked = this.groups.flatMap((group) =>
      group.teams.map((team, index) => ({ ...team, groupRank: index + 1 }))
    );

    // Collect teams ranked 1st, 2nd, and 3rd from each group
    for (let rank = 1; rank <= 3; rank++) {
      const teamsAtRank = allRanked.filter((team) => team.groupRank === rank);

      // Sort teams by points, goal difference, and points scored
      teamsAtRank.sort((a, b) => {
        if (b.points !== a.points) return b.points - a.points;
        if (b.pointDifference !== a.pointDifference)
          return b.pointDifference - a.pointDifference;
        return b.pointsScored - a.pointsScored;
      });

      this.qualifiedTeams.push(...teamsAtRank); // Add sorted teams to the list of qualified teams
    }

    // Limit the number of qualified teams to 8
    this.qualifiedTeams = this.qualifiedTeams.slice(0, 8);
    console.log("\nTimovi koji su se kvalifikovali u cetvrtfinale:");
    this.qualifiedTeams.forEach((team, index) =>
      console.log(`${index + 1}. ${team.name}`)
    );
  }

  drawKnockoutStage() {
    // Divide the qualified teams into 4 pots, each containing 2 teams
    const pots = [
      this.qualifiedTeams.slice(0, 2),
      this.qualifiedTeams.slice(2, 4),
      this.qualifiedTeams.slice(4, 6),
      this.qualifiedTeams.slice(6, 8),
    ];

    // Log the contents of each pot
    console.log("\nŠeširi:");
    pots.forEach((pot, index) => {
      console.log(`Šešir ${["D", "E", "F", "G"][index]}`);
      pot.forEach((team) => console.log(`    ${team.name}`));
    });

    // Function to draw pairs by shuffling and pairing teams from two pots
    const drawPairs = (pot1, pot2) => {
      const pairs = [];
      const shuffledPot1 = shuffle([...pot1]);
      const shuffledPot2 = shuffle([...pot2]);
      for (let i = 0; i < shuffledPot1.length; i++) {
        pairs.push([shuffledPot1[i], shuffledPot2[i]]);
      }
      return pairs;
    };

    // Draw pairs for the upper half of the quarterfinals from pots 0 and 3
    const quarterfinalsUpper = drawPairs(pots[0], pots[3]);
    // Draw pairs for the lower half of the quarterfinals from pots 1 and 2
    const quarterfinalsLower = drawPairs(pots[1], pots[2]);
    // Combine the drawn pairs into the knockout games for quarterfinals.
    this.knockoutGames.quarterfinals = [
      ...quarterfinalsUpper,
      ...quarterfinalsLower,
    ];

    // Log the quarterfinal matchups
    console.log("\nEliminaciona faza:");
    this.knockoutGames.quarterfinals.forEach((pair) => {
      console.log(`${pair[0].name} - ${pair[1].name}`);
    });
  }
}
