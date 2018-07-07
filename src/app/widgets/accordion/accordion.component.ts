import { Component, OnInit } from '@angular/core';
import { ItemService } from './item.service';

@Component({
  selector: 'app-accordion',
  templateUrl: './accordion.component.html',
  styleUrls: ['./accordion.component.scss'],
  providers: [ ItemService ]
})
export class AccordionComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
