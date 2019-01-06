import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-hover-edit',
  templateUrl: './hover-edit.component.html',
  styleUrls: ['./hover-edit.component.css']
})
export class HoverEditComponent implements OnInit {
  editMode = false;
  editValue!: string;

  @ViewChild("input") input!: ElementRef<HTMLInputElement>;

  _value!: string;

  @Input()
  get value() {return this._value;}
  set value(val: string) { 
    this._value = val;
    if (this.editMode) {
      this.editMode = false;
    }
  }

  @Output() save = new EventEmitter<string>();

  constructor() { }

  ngOnInit() {
  }

  toggleEdit() {
    this.editMode = true;
    this.editValue = this.value;
    setTimeout(() => this.input.nativeElement.focus());
  }

  cancel() {
    this.editMode = false;
  }

  commit() {
    if (!this.editMode) return this.cancel();
    if (this.editValue === this.value) return this.cancel();
    this.save.emit(this.editValue);
  }
}
