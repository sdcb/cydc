import { unwrapBoolean, SortedPagedQuery, SortedPagedDto, unwrapNumber } from 'src/app/shared/utils/paged-query';
import { formatDate } from '@angular/common';

export interface FoodOrderQueryDto extends SortedPagedDto {
  userName: string;
  startTime: string;
  endTime: string;
  isPayed: string;
  locationId: string;
  tasteId: string;
}

export class AdminOrderQuery extends SortedPagedQuery {
  userName = '';
  startTime: string | undefined = '';
  endTime: string | undefined = '';
  isPayed: boolean | undefined;
  locationId: number | undefined;
  tasteId: number | undefined;

  toDto(): FoodOrderQueryDto {
    const o = <FoodOrderQueryDto>super.toDto();
    if (this.userName !== '') { o.userName = this.userName; }
    if (this.startTime !== '' && this.startTime !== undefined) { o.startTime = formatDate(this.startTime, 'yyyy-MM-dd', 'en-us'); }
    if (this.endTime !== '' && this.endTime !== undefined) { o.endTime = formatDate(this.endTime, 'yyyy-MM-dd', 'en-us'); }
    if (this.isPayed !== undefined) { o.isPayed = this.isPayed ? 'true' : 'false'; }
    if (this.locationId !== undefined) { o.locationId = this.locationId.toString(); }
    if (this.tasteId !== undefined) { o.tasteId = this.tasteId.toString(); }
    return o;
  }

  replaceWith(p: Partial<FoodOrderQueryDto>) {
    super.replaceWith(p);
    this.userName = p.userName || '';
    this.startTime = p.startTime || '';
    this.endTime = p.endTime || '';
    this.isPayed = unwrapBoolean(p.isPayed);
    this.locationId = unwrapNumber(p.locationId);
    this.tasteId = unwrapNumber(p.tasteId);
  }
}

export interface FoodOrderDto {
  id: number;
  userName: string;
  orderTime: Date;
  menu: string;
  taste: string;
  location: string;
  details: string;
  price: number;
  comment: string;
  isPayed: boolean;
}
