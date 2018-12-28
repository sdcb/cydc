import { PagedDto, PagedQuery } from 'src/app/shared/utils/paged-query';


export interface UserQueryDto extends PagedDto {
  operator: string;
  name: string;
}

export class AdminUserQuery extends PagedQuery<UserQueryDto> {
  name: string = "";
  operator: BalanceOperator = BalanceOperator.All;

  replaceWith(p: Partial<UserQueryDto>) {
    super.replaceWith(p);
    this.name = p.name || "";
    this.operator = parseInt(p.operator!) || BalanceOperator.All;
  }

  toDto(): UserQueryDto {
    let o = <UserQueryDto>super.toDto();
    if (this.name !== "") o.name = this.name;
    if (this.operator !== BalanceOperator.All) o.operator = this.operator.toString();
    return o;
  }
}

export type AdminUserDto = {
  id: string;
  name: string;
  email: string;
  balance: number;
}

export enum BalanceOperator {
  All = 0,
  LessThanZero = 1,
  EqualToZero = 2,
  GreaterThanZero = 3,
}
