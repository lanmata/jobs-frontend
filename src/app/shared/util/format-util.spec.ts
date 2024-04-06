import { FormatUtil } from './format-util';
import { DatePipe } from '@angular/common';

describe('FormatUtil', () => {
  let formatUtil: FormatUtil;

  beforeEach(() => {
    formatUtil = new FormatUtil(new DatePipe('en-US'));
  });

  it('should format date time correctly', () => {
    const date = new Date(2022, 1, 1, 13, 30, 15);
    const formattedDate = formatUtil.datetime(date.toISOString());
    expect(formattedDate).toEqual('01-02-2022 01:30:15 PM');
  });

  it('should format date time in standard format correctly', () => {
    const date = new Date(2022, 1, 1, 13, 30, 15);
    const formattedDate = formatUtil.datetimeStandard(date.toISOString());
    expect(formattedDate).toEqual('2022-02-01 01:30:15');
  });

  it('should format date correctly', () => {
    const date = new Date(2022, 1, 1);
    const formattedDate = formatUtil.dateFormatter(date.toISOString());
    expect(formattedDate).toEqual('2022-02-01');
  });

  it('should format date time for file correctly', () => {
    const date = new Date(2022, 1, 1, 13, 30, 15);
    const formattedDate = formatUtil.dateTimeFileFormatter(date.toISOString());
    expect(formattedDate).toEqual('01022022_013015');
  });

  it('should format decimal correctly', () => {
    const formattedDecimal = formatUtil.decimal(1234.56);
    expect(formattedDecimal).toEqual('1,234.56');
  });

  it('should handle null decimal value', () => {
    const formattedDecimal = formatUtil.decimal(null);
    expect(formattedDecimal).toEqual(-9999999.99);
  });
});
