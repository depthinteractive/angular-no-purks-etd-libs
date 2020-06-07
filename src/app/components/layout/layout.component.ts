import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.less']
})
export class LayoutComponent implements OnInit {
  public ready: boolean;
  constructor() {
    this.ready = false;
  }

  ngOnInit() {
    setTimeout( () => {
      this.ready = true;
    }, 1000);
  }
}
