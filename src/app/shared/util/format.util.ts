import {DatePipe, DecimalPipe} from '@angular/common';

export class FormatUtil {
  readonly DATE_TIME_PATTERN = 'dd-MM-yyyy hh:mm:ss a';
  readonly DATE_TIME_FILE_PATTERN = 'ddMMyyyy_hhmmss';
  readonly DATE_PATTERN = 'yyyy-MM-dd';
  readonly THOUSAND_PATTERN = '1.2';
  readonly TEN_PATTERN = '1.2';
  readonly UNIT_PATTERN = '1.5';
  readonly CENT_PATTERN = '1.8';
  readonly DECIMAL_FORMAT_MAX_VALUE = -9999999.99;

  constructor(private datePipe: DatePipe){}

  public datetime = (value: string | null) => this.datePipe.transform(value, this.DATE_TIME_PATTERN);
  public dateFormatter = (value: string | null) => this.datePipe.transform(value, this.DATE_PATTERN);
  public dateTimeFileFormatter = (value: string | null) => this.datePipe.transform(value, this.DATE_TIME_FILE_PATTERN);

  public decimal = (value: any) => {
    value = new DecimalPipe('fr').transform(value, this.getPattern(Math.abs(value)));
    if (value == null){
      value = this.DECIMAL_FORMAT_MAX_VALUE;
    }
    return value;
  }

  private getPattern = (value: number) => {
    let patternSelected = '';
    if (value >= 1){
      if (value < 10){
        patternSelected = this.UNIT_PATTERN;
      }else if (value >= 10){
        if (value > 999.99){
          patternSelected = this.THOUSAND_PATTERN;
        }else {
          patternSelected = this.TEN_PATTERN;
        }
      }
    }else {
      patternSelected = this.CENT_PATTERN;
    }
    return patternSelected;
  }
}
