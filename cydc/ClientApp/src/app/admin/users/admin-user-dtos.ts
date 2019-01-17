import { SortedPagedQuery, SortedPagedDto } from 'src/app/shared/utils/paged-query';


export interface UserQueryDto extends SortedPagedDto {
  operator: string;
  name: string;
  email: string;
}

export class AdminUserQuery extends SortedPagedQuery {
  name = '';
  email = '';
  operator: BalanceOperator = BalanceOperator.All;

  replaceWith(p: Partial<UserQueryDto>) {
    super.replaceWith(p);
    this.name = p.name || '';
    this.email = p.email || '';
    this.operator = parseInt(p.operator!, 10) || BalanceOperator.All;
  }

  toDto(): UserQueryDto {
    const o = <UserQueryDto>super.toDto();
    if (this.name !== '') { o.name = this.name; }
    if (this.email !== '') { o.email = this.email; }
    if (this.operator !== BalanceOperator.All) { o.operator = this.operator.toString(); }
    return o;
  }
}

export interface AdminUserDto {
  id: string;
  name: string;
  email: string;
  balance: number;
  orderCount: number;
}

export enum BalanceOperator {
  All = 0,
  LessThanZero = 1,
  EqualToZero = 2,
  GreaterThanZero = 3,
}
