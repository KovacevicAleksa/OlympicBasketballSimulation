import { Team } from "./Team.js";
import { Group } from "./Group.js";

export class Tournament {
  constructor(groupsData) {
    // Map over the groupsData to create Group instances
    this.groups = Object.entries(groupsData).map(
      ([name, teams]) =>
        new Group(
          name,
          teams.map((t) => new Team(t.Team, t.ISOCode, t.FIBARanking)) // Create Team instances for each team in the group
        )
    );
    this.qualifiedTeams = [];
  }
}
