import { Component, OnInit } from '@angular/core';
import { TeamService } from "../../service/team.service";
import { ActivatedRoute } from "@angular/router";
import { Team } from "../../model/team";

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrl: './detail.component.scss'
})
export class DetailComponent implements OnInit {

  id: number = 0;
  team: Team;

  constructor(private route: ActivatedRoute, private teamService: TeamService) {
    this.route.queryParams.subscribe(params => {
      this.id = params['id'];
    });
  }

  ngOnInit(): void {
    if (this.id > 0) {
      this.getTeam();
    }
    let school = this.team?.school ?? "no Team";
    console.log("Found " + school + " with id of " + this.id);
  }

  getTeam() {
    console.log("getTeam() called...")
    this.team = this.teamService.getTeams()
      .find(t => t.id == this.id);
  }

}
