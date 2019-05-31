import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-click-edit',
  templateUrl: './click-edit.component.html',
  styleUrls: ['./click-edit.component.css']
})
export class ClickEditComponent implements OnInit {
  editMode = false;
  editValue!: string;

  @ViewChild("input", { static: false }) input!: ElementRef<HTMLInputElement>;

  _value!: string;

  @Input() type: string = "text";

  @Input()
  get value() {return this._value;}
  set value(val: string) { 
    this._value = val;
    if (this.editMode) {
      this.editMode = false;
      this.input.nativeElement.disabled = false;
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
    this.input.nativeElement.disabled = true;
    this.save.emit(this.editValue);
  }
}
