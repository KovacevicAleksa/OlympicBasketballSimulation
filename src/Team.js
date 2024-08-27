export class Team {
  constructor(name, isoCode, fibaRanking) {
    this.name = name;
    this.isoCode = isoCode;
    this.fibaRanking = fibaRanking;

    // Initialize additional attributes for tracking team performance
    this.points = 0;
    this.wins = 0;
    this.losses = 0;
    this.pointsScored = 0;
    this.pointsConceded = 0;
  }
}
