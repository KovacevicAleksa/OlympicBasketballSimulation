import { getRandomScore } from "./utils.js";

export class Game {
  constructor(team1, team2) {
    this.team1 = team1;
    this.team2 = team2;
    this.score1 = 0;
    this.score2 = 0;
  }

  play() {
    const rankDiff = Math.abs(this.team1.fibaRanking - this.team2.fibaRanking);
    const favoredTeam =
      this.team1.fibaRanking < this.team2.fibaRanking ? this.team1 : this.team2;
    const underdogTeam = favoredTeam === this.team1 ? this.team2 : this.team1;

    this.score1 = getRandomScore(favoredTeam === this.team1, rankDiff);
    this.score2 = getRandomScore(favoredTeam === this.team2, rankDiff);

    this.updateTeamStats();
  }
}
