import {Inject, Injectable} from '@angular/core';
import {DatePipe} from '@angular/common';
import {ConfigService} from './config.service';
import {RequestService} from './request.service';
import {TableColumn} from '../models/general/table/table-column.model';
import {TableRow} from '../models/general/table/table-row.model';
import {FileService} from './file.service';
import {NotificationsService} from './notifications.service';
import {select, Store} from '@ngrx/store';
import {States} from '../store/states';
import {AppSelectors} from '../store/app/app.selectors';
import getMode = AppSelectors.getMode;
import {cloneDeep, round} from 'lodash';
import {ParametersSelectors} from '../store/parameters/parameters.selectors';
import getOrganizationSelector = ParametersSelectors.getOrganizationSelector;
import {Entry} from '../models/entry.model';
import {ObservableUtil} from '../store/utils/observable.util';
import {Observable} from 'rxjs';
import {TableValueIsEmptyPipe} from '../pipes/table-value-is-empty.pipe';

const EXPORT_MESSAGE_TITLE = 'Экспорт в Excel';
const EXPORT_MESSAGE_ERROR = 'Ошибка экспорта';

enum FILENAME {
  addhoc_common = 'Cостояние лицевого счета',
  addhoc_details = 'Документы основания'
}

enum TYPES {
  xls = 'xls',
  xlsx = 'xlsx'
}

enum EXTINSIONS {
  xls = 'xls',
  xlsx = 'xlsx'
}

enum DEFAULT_CONTENTTYPE {
  xls = 'application/vnd.ms-excel',
  xlsx = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
}

@Injectable({
  providedIn: 'root'
})
export class ReportService {
  private reportTemplateFileName: string;
  private documentsTemplateFileName: string;
  private organization$: Observable<Entry> = this.store.pipe(
    select(getOrganizationSelector)
  );

  constructor(
    private store: Store<States>,
    private datePipe: DatePipe,
    private $config: ConfigService,
    private $file: FileService,
    private $request: RequestService,
    private $notifications: NotificationsService,
    @Inject(TableValueIsEmptyPipe) private $isEmpty: TableValueIsEmptyPipe
  ) {
    this.store
      .pipe(
        select(getMode)
      )
      .subscribe(mode => {
        this.reportTemplateFileName = this.$config.get('path', 'reports', 'report', mode, 'excel');
        this.documentsTemplateFileName = this.$config.get('path', 'reports', 'documents', mode, 'excel');
      });
  }

  public getDataReport(rAccount: string, rDate: Date, rData: TableRow[], rColumns: TableColumn[]): void {
    rData = cloneDeep(rData);
    const reportData: object = this.prepareDataToExport(rAccount, rDate, rData, rColumns);
    const reportDate = this.datePipe.transform(rDate, 'dd.MM.yyyy');
    const reportFileName = `${FILENAME.addhoc_common} - ${rAccount}_${reportDate}`;

    this.loadReport(reportData, this.reportTemplateFileName, TYPES.xlsx, reportFileName);
  }

  public getDetailsDataReport(rAccount: string, rDate: Date, rData: TableRow[]): void {
    rData = cloneDeep(rData);
    const reportData: object = this.prepareDetailsDataToExport(rAccount, rDate, rData);
    const reportDate = this.datePipe.transform(rDate, 'dd.MM.yyyy');
    const reportFileName = `${FILENAME.addhoc_details} - ${rAccount}_${reportDate}`;

    this.loadReport(reportData, this.documentsTemplateFileName, TYPES.xlsx, reportFileName);
  }

  private prepareDataToExport(rAccount: string, rDate: Date, rData: TableRow[], _rColumns: TableColumn[]): object {
    const $isEmpty: TableValueIsEmptyPipe = this.$isEmpty;
    const currentDate = new Date();
    const deletedSubsidiaryTargetColumns: string[] = ['DATA_42', 'DATA_59', 'DATA_140', 'BALANCE_TOTAL', 'LETTER_OF_CREDIT_BALANCE', 'NON_EXPENDABLE_FUNDS'];
    const deletedObligationColumns: string[] = [
      'DATA_44', 'DATA_45', 'DATA_46', 'DATA_47', 'DATA_48', 'DATA_49',
      'DATA_50', 'DATA_51', 'UNUSED_INCOME_BALANCE', 'UNUSED_PAYOUT_BALANCE'
    ];
    const rColumns = _rColumns.reduce((rColumnsAcc: {}, column: TableColumn) => {
      rColumnsAcc[column.key] = column.visible;

      if (column.children && column.children.length > 0) {
        column.children.forEach(_column =>
          rColumnsAcc[_column.key] = _column.visible
        );
      }

      return rColumnsAcc;
    }, {});

    rData = this.stringifyAllRows(prepareRows(rData));

    return {
      rAccount: rAccount,
      rDate: this.datePipe.transform(rDate, 'dd.MM.yyyy'),
      rCreateDate: this.datePipe.transform(currentDate, 'dd.MM.yyyy'),
      rCreateTime: this.datePipe.transform(currentDate, 'HH:mm'),
      rData, rColumns, ...this.organization
    };

    function prepareRows(data: TableRow[]): TableRow[] {
      expandAllRows(data);
      clearRows(data);
      deleteParentFromRow(data);
      deleteExcludedRows(data);
      deleteAllChildren(data);

      return data;
    }

    function clearRows(data: TableRow[]): void {
      data
        .filter(row => !!row.group)
        .forEach(row => {
          if (row.group.includes('subsidary_target')) {
            deletedSubsidiaryTargetColumns.forEach(deletedColumn =>
              delete row[deletedColumn]
            );
          }

          if ($isEmpty.transform(row.Obligation)) {
            deletedObligationColumns.forEach(deletedColumn =>
              row.Obligation = '-'
            );
          }
        });
    }

    function expandAllRows(data: TableRow[]): void {
      while (
        data.some(row =>
          row.children && row.children.length > 0 && !row.expand
        )
        ) {
        const rowIndex = data.findIndex(_row =>
          _row.children && _row.children.length > 0 && !_row.expand
        );
        const row = {...data[rowIndex]};

        data.splice(rowIndex, 1, row, ...row.children);
        row.expand = true;
      }
    }

    function deleteParentFromRow(data: TableRow[]): void {
      data.forEach((_, index) => {
        const row = {...data[index]};
        delete row.parent;

        if (row.children && row.children.length > 0) {
          row.children = deleteParentFromRow(row.children);
        }

        data[index] = row;
      });
    }

    function deleteExcludedRows(data: TableRow[]): void {
      data
        .filter(row => row.excludeFromReport)
        .forEach((row) => {
          const rowIndex: number = data.findIndex(_row => _row === row);
          data.splice(rowIndex, 1);
        });
    }

    function deleteAllChildren(data: TableRow[]): void {
      data.forEach(row => {
        delete row.children;
        delete row.indicators;
        delete row.level;
      });
    }
  }

  private prepareDetailsDataToExport(rAccount: string, rDate: Date, rData: TableRow[]): object {
    const currentDate = new Date();

    rData = this.stringifyAllRows(rData);

    return {
      rAccount: rAccount,
      rDate: this.datePipe.transform(rDate, 'dd.MM.yyyy'),
      rCreateDate: this.datePipe.transform(currentDate, 'dd.MM.yyyy'),
      rCreateTime: this.datePipe.transform(currentDate, 'HH:mm'),
      rData, ...this.organization
    };
  }

  private saveReport(reportFileName: string, reportType: string, reportBinaryData): void {
    this.$file
      .save(reportFileName, reportType, reportBinaryData)
      .subscribe((result: boolean) => {
        if (result) {
          this.$notifications.createNotification({
            title: EXPORT_MESSAGE_TITLE,
            message: 'Файл успешно сохранен',
            type: 'success'
          });
        } else {
          this.$notifications.createNotification({
            title: EXPORT_MESSAGE_TITLE,
            message: EXPORT_MESSAGE_ERROR,
            type: 'danger'
          });
        }
      });
  }

  private loadReport(reportData, reportTemplateFileName, reportType, reportFileName: string): void {
    const reportUrl = this.$config.get('rest', 'export') + `?timestamp=${(new Date().getTime()).toString(36)}`;
    const report = {reportData, reportFile: reportTemplateFileName};

    this.$request
      .post(
        reportUrl,
        report,
        {responseType: 'arrayBuffer'}
      )
      .subscribe((response: { success, fail, data, headers: Headers }) => {
        if (response.success) {
          this.saveReport(reportFileName, reportType, response.data);
        } else {
          this.$notifications.createNotification({
            title: EXPORT_MESSAGE_TITLE,
            message: EXPORT_MESSAGE_ERROR,
            type: 'danger'
          });
        }
      });
  }

  /*Добавляем это, чтобы в джаспер нормально передавались значения с плавающей точкой*/
  private stringifyAllRows(data: TableRow[]): TableRow[] {
    data.forEach(row =>
      Object.keys(row)
        .forEach((key, index) => {
          const value: any = row[key];
          if (typeof value === 'undefined' || value === null) {
            row[key] = '';
          } else if (typeof value === 'number') {
            try {
              row[key] = round(Number(value), 2)
                .toFixed(2)
                .replace('.', ',');
            } catch (e) {
              console.error(`Error convert value ${value} to nubmer for filed ${key} for ${index} data row`);
            }
          }
        })
    );

    return data;
  }

  private get organization(): Entry {
    const organization: Entry = ObservableUtil.take(this.organization$) || {};
    return {
      rOrganizationName: organization.orgName || '-',
      rOrganizationInn: organization.inn || '-',
      rOrganizationKpp: organization.kpp || '-',
      rOrganizationOkpo: organization.okpo || '-',
    };
  }
}

