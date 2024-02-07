import { Injectable } from '@angular/core';

// @ts-ignore
import * as teamData from "../../assets/json/teams.json";
import { Team } from "../model/team";

@Injectable({
  providedIn: 'root'
})
export class TeamService {

  private teams: Team[] = (teamData as any).default;

  constructor() { }

  public getTeams() {
    return this.teams;
  }

}
