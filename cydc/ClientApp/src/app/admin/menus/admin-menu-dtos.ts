import { SortedPagedDto, SortedPagedQuery, unwrapNumber } from 'src/app/shared/utils/paged-query';

export interface MenuQueryDto extends SortedPagedDto {
    details: string;
    price: string;
    startTime: string;
    endTime: string;
  }

  export class AdminMenuQuery extends SortedPagedQuery {
    details = '';
    price: number | undefined;
    startTime: string | undefined = '';
    endTime: string | undefined;

    toDto(): MenuQueryDto {
      const o = <MenuQueryDto>super.toDto();
      if (this.details !== '') { o.details = this.details; }
      if (this.price !== undefined && this.price !== null) { o.price = this.price.toString(); }
      if (this.startTime !== '' && this.startTime !== undefined) { o.startTime = new Date(this.startTime).toISOString(); }
      if (this.endTime !== '' && this.endTime !== undefined) { o.endTime = new Date(this.endTime).toISOString(); }
      return o;
    }

    replaceWith(p: Partial<MenuQueryDto>) {
      super.replaceWith(p);
      this.details = p.details || '';
      this.price = unwrapNumber(p.price);
      this.startTime = p.startTime;
      this.endTime = p.endTime;
    }
  }

  export interface MenuDto {
    id: number;
    createTime: number;
    title: string;
    details: string;
    price: number;
    enabled: boolean;
    orderCount: number;
  }

  export class MenuCreateDto {
    title = '普通套餐';
    details = '';
    price = 12;
  }
