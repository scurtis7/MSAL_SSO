import { Component, OnInit } from '@angular/core';
import { CacheService } from "../../service/cache.service";
import { IdToken } from "../../model/id-token";
import { AcctInfo } from "../../model/acct-info";

@Component({
  selector: 'app-storage',
  templateUrl: './storage.component.html',
  styleUrl: './storage.component.scss'
})
export class StorageComponent implements OnInit {

  idToken: IdToken;
  accountInfo: AcctInfo;

  constructor(private cacheService: CacheService) {
  }

  ngOnInit() {
    this.idToken = this.cacheService.getIdToken();
    this.accountInfo = this.cacheService.getAccountInfo();
  }

}
