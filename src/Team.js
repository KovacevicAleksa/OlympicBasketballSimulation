export class Team {
  constructor(name, isoCode, fibaRanking, form) {
    this.name = name;
    this.isoCode = isoCode;
    this.fibaRanking = fibaRanking;
    this.form = form;

    // Initialize additional attributes for tracking team performance
    this.points = 0;
    this.wins = 0;
    this.losses = 0;
    this.pointsScored = 0;
    this.pointsConceded = 0;
  }

  // Dynamically calculates the point difference
  get pointDifference() {
    return this.pointsScored - this.pointsConceded;
  }
}
