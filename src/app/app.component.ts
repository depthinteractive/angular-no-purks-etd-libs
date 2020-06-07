import {Component, OnInit} from '@angular/core';
import {SystemInfoService} from './services/system-info.service';
const TEST_LOGIN_REGEX = /[\\?&]testLogin=([^&#]*)/g;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent implements OnInit {
  title = 'purks-data-mart';

  constructor(
    private $systemInfo: SystemInfoService
  ) {
  }

  ngOnInit(): void {
    this.$systemInfo.onInit();
  }
}
