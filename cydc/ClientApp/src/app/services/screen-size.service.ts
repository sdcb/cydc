import { Injectable } from '@angular/core';
import { BreakpointObserver } from '@angular/cdk/layout';

enum SizeLevel {
  xs = 0,
  sm = 1,
  md = 2,
  lg = 3,
  xl = 4,
}

const levelMap: { [key: string]: SizeLevel } = {
  ["(max-width: 576px)"]: SizeLevel.xs,
  ["(max-width: 768px)"]: SizeLevel.sm,
  ["(max-width: 992px)"]: SizeLevel.md,
  ["(max-width: 1200px)"]: SizeLevel.lg,
};

@Injectable({
  providedIn: 'root'
})
export class ScreenSizeService {
  private sizeLevel!: SizeLevel;
  get xs() { return this.sizeLevel <= SizeLevel.xs; }
  get sm() { return this.sizeLevel <= SizeLevel.sm; }
  get md() { return this.sizeLevel <= SizeLevel.md; }
  get lg() { return this.sizeLevel <= SizeLevel.lg; }
  get xl() { return this.sizeLevel <= SizeLevel.xl; }

  constructor(breakpointObserver: BreakpointObserver) {
    breakpointObserver.observe(Object.getOwnPropertyNames(levelMap)).subscribe(m => {
      let entry = Object.entries(m.breakpoints).filter(x => x[1])[0];
      if (entry !== undefined) {
        this.sizeLevel = levelMap[entry[0]];
      } else {
        this.sizeLevel = SizeLevel.xl;
      }
    });
  }
}
