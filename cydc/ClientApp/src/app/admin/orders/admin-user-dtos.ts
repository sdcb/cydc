import { PagedDto, PagedQuery } from 'src/app/shared/utils/paged-query';

export interface FoodOrderQueryDto extends PagedDto {
  userName: string;
  startTime: string;
  endTime: string;
  isPayed: string;
}

export class AdminOrderQuery extends PagedQuery<FoodOrderQueryDto> {
  userName: string = "";
  startTime: Date | undefined;
  endTime: Date | undefined;
  isPayed: boolean | undefined;

  toDto(): FoodOrderQueryDto {
    let o = <FoodOrderQueryDto>super.toDto();
    if (this.userName !== "") o.userName = this.userName;
    if (this.startTime !== undefined) o.startTime = this.startTime.toString();
    if (this.endTime !== undefined) o.endTime = this.endTime.toString();
    if (this.isPayed !== undefined) o.isPayed = this.isPayed ? "1" : "0";
    return o;
  }

  replaceWith(p: Partial<FoodOrderQueryDto>) {
    super.replaceWith(p);
    this.userName = p.userName || "";
    this.startTime = parseDate(p.startTime);
    this.endTime = parseDate(p.endTime);
    this.isPayed = parseBoolean(p.isPayed);
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

function parseDate(strDate: string | undefined) {
  if (strDate === undefined) return undefined;
  return new Date(strDate);
}

function parseBoolean(boolStr: string | undefined) {
  if (boolStr === undefined) return undefined;
  return boolStr === "1";
}
