import { getRandomScore } from "./utils.js";

export class Game {
  // Constructor initializes the game with two teams and sets their scores to 0
  constructor(team1, team2) {
    this.team1 = team1;
    this.team2 = team2;
    this.score1 = 0;
    this.score2 = 0;
  }

  // Method to simulate the game between team1 and team2
  play() {
    // Calculate the difference in FIBA rankings between the two teams
    const rankDiff = Math.abs(this.team1.fibaRanking - this.team2.fibaRanking);

    // Determine which team is favored based on FIBA rankings
    const favoredTeam =
      this.team1.fibaRanking < this.team2.fibaRanking ? this.team1 : this.team2;
    const underdogTeam = favoredTeam === this.team1 ? this.team2 : this.team1;

    // Generate random scores for both teams
    this.score1 = getRandomScore(
      favoredTeam === this.team1,
      rankDiff,
      this.team1.form
    );
    this.score2 = getRandomScore(
      favoredTeam === this.team2,
      rankDiff,
      this.team2.form
    );

    //console.log(`${this.team2.name} ima formu ${this.team2.form} `);
    //console.log(`${this.team1.name} ima formu ${this.team1.form} `);

    // Update the stats of the teams based on the scores
    this.updateTeamStats();
  }

  // Method to update the statistics of both teams based on the game result
  updateTeamStats() {
    // Update the points scored and conceded for both teams
    this.team1.pointsScored += this.score1;
    this.team1.pointsConceded += this.score2;
    this.team2.pointsScored += this.score2;
    this.team2.pointsConceded += this.score1;

    // Update wins, losses, and points for both teams based on the game result
    if (this.score1 > this.score2) {
      this.team1.wins++; // Increase wins for team1
      this.team1.points += 2; // Award 2 points for a win
      this.team2.losses++; // Increase losses for team2
      this.team2.points += 1; // Award 1 point for a loss
      this.team2.form -= 2; //Form --2
      this.team1.form += 2; //Form ++2
    } else {
      this.team2.wins++;
      this.team2.points += 2;
      this.team1.losses++;
      this.team1.points += 1;
      this.team2.form += 2;
      this.team1.form -= 2;
    }
  }

  // Method to return a string representation of the game result
  toString() {
    return `${this.team1.name} ${this.score1} - ${this.score2} ${this.team2.name}`;
  }
}
