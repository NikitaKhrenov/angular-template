import { ItemService } from './../item.service';
import { Subscription } from 'rxjs/Subscription';
import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Item } from '../item';


@Component({
  selector: 'app-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.scss']
})
export class ItemComponent implements OnInit, OnDestroy {

  @Input() item: Item;

  private itemSubscription: Subscription;

  constructor(private itemService: ItemService) { }

  ngOnInit() {
    this.itemSubscription = this.itemService.visible$.subscribe((item: Item) => {
      this.item.isVisible = item.title === this.item.title && !this.item.isVisible;
    });
  }

  ngOnDestroy() {
    if (this.itemSubscription) {
      this.itemSubscription.unsubscribe();
    }
  }

  toggle() {
    this.itemService.visible$.next(this.item);
  }

}
