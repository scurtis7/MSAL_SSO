import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { Team } from "../../model/team";
import { TeamService } from "../../service/team.service";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit, AfterViewInit {

  @ViewChild(MatSort) sort: MatSort;

  displayedColumns: string[] = ['id', 'school', 'conference'];
  dataSource: MatTableDataSource<Team> = new MatTableDataSource<Team>();
  recordCount: number;

  private teams: Team[];

  constructor(private teamService: TeamService) {
  }

  ngOnInit() {
    this.getTeamList();
  }

  ngAfterViewInit() {
    this.resetDatasource();
  }

  resetDatasource() {
    this.dataSource = new MatTableDataSource<Team>(this.teams);
    this.dataSource.data = this.teams;
    this.dataSource.sort = this.sort;
    this.recordCount = this.dataSource.filteredData.length;
  }

  private getTeamList() {
    this.teams = this.teamService.getTeams();
    console.log(this.teams ?? "");
  }

}
