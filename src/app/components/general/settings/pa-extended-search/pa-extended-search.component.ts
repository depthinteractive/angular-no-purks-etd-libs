import {ChangeDetectionStrategy, Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';
import {Entry} from '../../../../models/entry.model';
import {select, Store} from '@ngrx/store';
import {States} from '../../../../store/states';
import {BehaviorSubject, combineLatest, fromEvent, Observable, Subject} from 'rxjs';
import {getDictSelector} from '../../../../store/dicts/dicts.selectors';
import {debounceTime, map, pluck, shareReplay} from 'rxjs/operators';
import {ObservableUtil} from '../../../../store/utils/observable.util';
import {PAGINATION, WIDTH_CONFIG} from './pa-extended-search.utils';
import {IPagination} from '../../../../models/pagination.model';

@Component({
  selector: 'app-pa-extended-search',
  templateUrl: './pa-extended-search.component.html',
  styleUrls: ['./pa-extended-search.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PaExtendedSearchComponent implements OnInit {
  public selectedOrganization: Entry | null = null;
  public preSelectedOrganization: Entry | null = null;
  public organizations$: Observable<Entry[]>;
  public widthConfig: string[] = WIDTH_CONFIG;
  public pagination: IPagination = PAGINATION;

  @ViewChild('searchInput', {read: ElementRef})
  private searchInput: ElementRef;

  @Input()
  public show: boolean = false;

  @Input('selected-pa')
  public set inputSelectedPa(selectedPa: string) {
    const organizations: Entry[] = ObservableUtil.take(this.organizationsDict$, []);
    const selectedOrganization: Entry = organizations.find(organization => organization.key === selectedPa);

    if (selectedOrganization) {
      this.preSelectedOrganization = this.selectedOrganization = selectedOrganization;
    }

    this.selectOrganization.emit(this.selectedOrganization);
  }

  @Output()
  public selectPaOrganization: EventEmitter<Entry> = new EventEmitter<Entry>();

  @Output()
  public selectOrganization: EventEmitter<Entry> = new EventEmitter<Entry>();

  @Output()
  public showChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor(
    private store: Store<States>
  ) {
  }

  public get paginationStart(): number {
    const {size, index}: IPagination = this.pagination;
    return size * (index - 1);
  }

  public get paginationEnd(): number {
    return this.paginationStart + this.pagination.size;
  }

  public clear(): void {
    const input: HTMLInputElement = this.searchInput.nativeElement;
    input.value = null;
    input.dispatchEvent(new Event('input'));
    this.pagination.size = this.pagination.sizeOptions[0];
    this.pagination.index = 1;
  }

  public close(): void {
    this.show = false;
    this.showChange.emit(false);
    this.clear();
  }

  public confirm(): void {
    this.selectPaOrganization.emit(this.selectedOrganization);
    this.close();
    this.preSelectedOrganization = this.selectedOrganization;
  }

  public select(row: Entry): void {
    this.selectedOrganization = this.selectedOrganization !== row ? row : null;
  }

  public ngOnInit(): void {
    const searchValue$: Observable<string> = fromEvent(this.searchInput.nativeElement, 'input').pipe(
      pluck('target', 'value'),
      map((value: string) =>
        value.trim().toLowerCase()
      ),
      shareReplay(1)
    );

    this.organizations$ = combineLatest(this.organizationsDict$, searchValue$).pipe(
      map(([organizations, query]: [Entry[], string]) =>
        !query
          ? organizations
          : organizations.filter((organization: Entry) =>
            Object
              .values(organization)
              .filter(value => value !== null)
              .some((value: string) =>
                value.toLowerCase().includes(query)
              )
          )
      )
    );

    setTimeout(() =>
      this.clear()
    );
  }

  private get organizationsDict$(): Observable<Entry[]> {
    return this.store.pipe(
      select(getDictSelector, {name: 'pAccountWithPBudget'})
    );
  }
}
