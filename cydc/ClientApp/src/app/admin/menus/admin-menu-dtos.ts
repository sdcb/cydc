import { SortedPagedQuery, SortedPagedDto, unwrapNumber } from 'src/app/shared/utils/paged-query';
import { ScreenSizeService } from 'src/app/services/screen-size.service';

export interface MenuQueryDto extends SortedPagedDto {
  details: string;
  price: string;
  startTime: string;
  endTime: string;
}

export class AdminMenuQuery extends SortedPagedQuery<MenuQueryDto> {
  details: string = "";
  price: number | undefined;
  startTime: string | undefined = "";
  endTime: string | undefined;

  toDto(): MenuQueryDto {
    let o = <MenuQueryDto>super.toDto();
    if (this.details !== "") o.details = this.details;
    if (this.price !== undefined && this.price !== null) o.price = this.price.toString();
    if (this.startTime !== "" && this.startTime !== undefined) o.startTime = new Date(this.startTime).toISOString();
    if (this.endTime !== "" && this.endTime !== undefined) o.endTime = new Date(this.endTime).toISOString();    
    return o;
  }

  replaceWith(p: Partial<MenuQueryDto>) {
    super.replaceWith(p);
    // todo: menu search items
    this.details = p.details || "";
    this.price = unwrapNumber(p.price);
    this.startTime = p.startTime;
    this.endTime = p.endTime;
  }
}

export function menuColumns(size: ScreenSizeService) {
  if (size.md) return ["createTime", "details", "price", "enabled", "orderCount"];
  return ["id", "createTime", "name", "details", "price", "enabled", "orderCount"];
}

export type MenuDto = {
  id: number;
  createTime: number;
  name: string;
  details: string;
  price: number;
  enabled: boolean;
  orderCount: number;
}
