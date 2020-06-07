import {
  Component,
  OnInit,
  HostListener,
  ElementRef,
  ViewChild,
  ViewContainerRef,
  NgZone, OnDestroy
} from '@angular/core';

import {Table} from '../../../models/general/table/table.model';
import {TableRow} from '../../../models/general/table/table-row.model';
import {GeneralTableService} from './table.service';
import {Observable, Subject} from 'rxjs';
import {NzPaginationComponent} from 'ng-zorro-antd';
import {Entry} from '../../../models/entry.model';
import {debounceTime, map} from 'rxjs/operators';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.less'],
  providers: [GeneralTableService]
})
export class TableComponent implements OnInit, OnDestroy {
  @ViewChild('scroll', {read: ViewContainerRef})
  public scroll: ViewContainerRef;

  @ViewChild(NzPaginationComponent, {read: NzPaginationComponent})
  public nzPagination: NzPaginationComponent;
  public mode: string;
  public table$: Observable<{ data, loading }> = this.$service.getTable$();
  public table: Table;
  public rows: TableRow[] = [];

  public scrollPosition: { left, top } = {left: 0, top: 0};
  public scrollPositionX: string;
  public scrollPositionY: string;

  public tableIsEmpty: boolean;
  public isScrolledLeft: boolean;
  public isScrolledTop: boolean;
  public subsidaryTargets: Entry[] = [];
  public noResult$: Observable<string>;

  constructor(
    private $service: GeneralTableService,
    private zone: NgZone
  ) {
    this.$service.mode$.subscribe(mode =>
      this.mode = mode
    );
  }

  public get noResult(): string {
    const {source, rows} = this.table.data;
    if (!source || source.length === 0) {
      return 'Выберите параметры и нажмите "Сформировать отчет"';
    } else if (source && source.length > 0 && rows.length === 0) {
      return 'Нет данных, соответствующих условиям фильтров';
    }
    return;
  }


  public expandRowChange(row, $event) {
    this.table.expandRowChange(row, $event);
    this.pagingChange();
  }

  public openDetails(row: {}, indicators: string[] | null = null, hasNotChildren: boolean = false, group: string | null = null): void {
    if (!hasNotChildren) {
      return;
    }
    this.$service.openDetails(row, indicators);
  }

  public tableScroll(): void {
    const ps: Element = this.scroll.element.nativeElement.querySelector('.ps');

    this.zone.run(() => {
      this.scrollPosition.left = ps.scrollLeft;
      this.scrollPosition.top = ps.scrollTop;

      this.isScrolledLeft = this.scrollPosition.left > 0 && this.table.data.rows && this.table.data.rows.length > 0;
      this.isScrolledTop = this.scrollPosition.top > 0 && this.table.data.rows && this.table.data.rows.length > 0;
      this.scrollPositionX = this.scrollPosition.left + 'px';
      this.scrollPositionY = this.scrollPosition.top + 'px';
    });
  }

  public pagingIndexChange($event) {
    this.pagingChange();
  }

  public pagingSizeChange($event) {
    this.pagingChange();
  }

  public openObligationDocuments(row: Entry): void {
    this.$service.openObligationDocuments(row);
  }

  public ngOnInit(): void {
    this.table = this.$service.onInit();
    this.rows = this.table.data.rows;

    this.table.onChange.subscribe(() => {
      this.pagingChange();

      this.tableIsEmpty = !this.table.data.rows || this.table.data.rows.length === 0;
    });

    this.$service.subsidaryTargets$.subscribe((subsidaryTargets) =>
      this.subsidaryTargets = subsidaryTargets
    );

    setTimeout(() =>
      this.nzPagination.locale.items_per_page = ' на странице'
    );

    this.noResult$ = this.table$.pipe(
      map(({loading}) => {
        if (loading) {
          return null;
        }

        const {source, rows} = this.table.data;
        if (!source || source.length === 0) {
          return 'Выберите параметры и нажмите "Сформировать отчет"';
        } else if (source && source.length > 0 && rows.length === 0) {
          return 'Нет данных, соответствующих условиям фильтров';
        }
      })
    );
  }

  public ngOnDestroy(): void {
    this.$service.onDestroy();
  }

  private pagingChange(): void {
    if (!this.table.data.rows) {
      this.rows = [];
    } else {
      this.$service.pagingChange();

      this.rows = this.table.data.rows.slice(
        this.table.paging.start,
        this.table.paging.end
      );
    }
  }
}
