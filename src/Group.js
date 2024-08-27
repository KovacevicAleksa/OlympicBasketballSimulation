import { Game } from "./Game.js";

export class Group {
  constructor(name, teams) {
    this.name = name;
    this.teams = teams;
    this.games = [];
  }

  // Simulates all games between teams in the group
  playGames() {
    for (let i = 0; i < this.teams.length; i++) {
      for (let j = i + 1; j < this.teams.length; j++) {
        // Create a new game between two teams
        const game = new Game(this.teams[i], this.teams[j]);
        game.play();
        this.games.push(game); // Store the game result in the games array
      }
    }
  }

  // Ranks teams based on points, point difference, and points scored
  rankTeams() {
    this.teams.sort((a, b) => {
      // Sort by points in descending order
      if (b.points !== a.points) return b.points - a.points;
      // If points are equal, sort by point difference in descending order
      if (b.pointDifference !== a.pointDifference)
        return b.pointDifference - a.pointDifference;
      // If point difference is also equal, sort by points scored in descending order
      return b.pointsScored - a.pointsScored;
    });
  }
}
