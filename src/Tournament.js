import { Group } from "./Group.js";
import { Team } from "./Team.js";
import { shuffle } from "./utils.js";
import { Game } from "./Game.js";

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

  // Creates a new game between two teams
  createGame(team1, team2) {
    return new Game(
      { ...team1 }, // Creates a shallow copy of team1 to preserve all properties
      { ...team2 } // including fibaRanking
    );
  }

  // Simulates one round of the tournament
  simulateRound(games) {
    const winners = []; // List of winners
    games.forEach((game) => {
      game.play(); // Play the game
      console.log(game.toString()); // Print the game result
      // Determine the winner based on the score and add to winners list
      winners.push(game.score1 > game.score2 ? game.team1 : game.team2);
    });
    return winners; // Return the list of winners
  }

  // Simulates the knockout stage of the tournament
  simulateKnockoutStage() {
    console.log("\nČetvrtfinale:");
    // Create quarterfinal games based on predefined pairs
    const quarterfinalGames = this.knockoutGames.quarterfinals.map((pair) =>
      this.createGame(pair[0], pair[1])
    );
    const semifinals = this.simulateRound(quarterfinalGames); // Simulate quarterfinals

    console.log("\nPolufinale:");
    // Create semifinal games using the winners from the quarterfinals
    const semifinalGames = [
      this.createGame(semifinals[0], semifinals[1]),
      this.createGame(semifinals[2], semifinals[3]),
    ];
    const finalists = this.simulateRound(semifinalGames); // Simulate semifinals

    console.log("\nUtakmica za treće mesto:");
    // Create and play the third place game between the semifinal losers
    this.knockoutGames.bronzeGame = this.createGame(
      semifinalGames[0].score1 > semifinalGames[0].score2
        ? semifinalGames[0].team2
        : semifinalGames[0].team1,
      semifinalGames[1].score1 > semifinalGames[1].score2
        ? semifinalGames[1].team2
        : semifinalGames[1].team1
    );
    this.knockoutGames.bronzeGame.play(); // Play the bronze game
    console.log(this.knockoutGames.bronzeGame.toString()); // Print the bronze game result

    console.log("\nFinale:");
    // Create and play the final game using the semifinal winners
    this.knockoutGames.finalGame = this.createGame(finalists[0], finalists[1]);
    this.knockoutGames.finalGame.play(); // Play the final game
    console.log(this.knockoutGames.finalGame.toString()); // Print the final game result

    this.displayMedalists(); // Display the medalists
  }

  // Displays the winners of the gold, silver, and bronze medals
  displayMedalists() {
    const goldWinner =
      this.knockoutGames.finalGame.score1 > this.knockoutGames.finalGame.score2
        ? this.knockoutGames.finalGame.team1
        : this.knockoutGames.finalGame.team2; // Determine gold winner
    const silverWinner =
      goldWinner === this.knockoutGames.finalGame.team1
        ? this.knockoutGames.finalGame.team2
        : this.knockoutGames.finalGame.team1; // Determine silver winner
    const bronzeWinner =
      this.knockoutGames.bronzeGame.score1 >
      this.knockoutGames.bronzeGame.score2
        ? this.knockoutGames.bronzeGame.team1
        : this.knockoutGames.bronzeGame.team2; // Determine bronze winner

    console.log("\nMedalje:");
    console.log(`1. ${goldWinner.name}`);
    console.log(`2. ${silverWinner.name}`);
    console.log(`3. ${bronzeWinner.name}`);
  }
}
