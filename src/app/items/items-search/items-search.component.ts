import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { ItemsService } from '../../shared/items.service';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/switchMap';

@Component({
  selector: 'app-items-search',
  templateUrl: './items-search.component.html',
  styleUrls: ['./items-search.component.css']
})
export class ItemsSearchComponent implements OnInit {
  // takes results and emit up
  @Output() onResults = new EventEmitter();
  @ViewChild('itemsSearch') itemsSearch;

  constructor(private itemsService: ItemsService) {
  }

  ngOnInit() {
    const search$ = Observable.fromEvent(this.getNativeElement(this.itemsSearch), 'keyup')
      // throttle by debounce and untilChanged. guards to prevent calls to server
      .debounceTime(200)
      .distinctUntilChanged()
      // grabbing text value target.value
      .map((event: any) => event.target.value)
      // calling service
      .switchMap(term => this.itemsService.search(term))
      // emitting up to parent
      .subscribe(items => this.onResults.emit(items));
  }

  getNativeElement(element) {
    return element.nativeElement;
  }
}
