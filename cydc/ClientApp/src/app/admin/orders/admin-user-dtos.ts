import { PagedDto, PagedQuery, unwrapDate, unwrapBoolean, SortedPagedQuery, SortedPagedDto } from 'src/app/shared/utils/paged-query';

export interface FoodOrderQueryDto extends SortedPagedDto {
  userName: string;
  startTime: string;
  endTime: string;
  isPayed: string;
}

export class AdminOrderQuery extends SortedPagedQuery<FoodOrderQueryDto> {
  userName: string = "";
  startTime: string | undefined = "";
  endTime: string | undefined = "";
  isPayed: boolean | undefined;

  toDto(): FoodOrderQueryDto {
    let o = <FoodOrderQueryDto>super.toDto();
    if (this.userName !== "") o.userName = this.userName;
    if (this.startTime !== "" && this.startTime !== undefined) o.startTime = new Date(this.startTime).toISOString();
    if (this.endTime !== "" && this.endTime !== undefined) o.endTime = new Date(this.endTime).toISOString();
    if (this.isPayed !== undefined) o.isPayed = this.isPayed ? "1" : "0";
    return o;
  }

  replaceWith(p: Partial<FoodOrderQueryDto>) {
    super.replaceWith(p);
    this.userName = p.userName || "";
    this.startTime = p.startTime;
    this.endTime = p.endTime;
    this.isPayed = unwrapBoolean(p.isPayed);
  }
}

export type FoodOrderDto = {
  id: number;
  userName: string;
  orderTime: Date;
  menu: string;
  details: string;
  price: number;
  comment: string;
  isPayed: boolean;
}
