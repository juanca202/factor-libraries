import { Component, OnInit, forwardRef, Input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'ft-rating',
  templateUrl: './rating.component.html',
  styleUrls: ['./rating.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => RatingComponent),
      multi: true
    }
  ]
})
export class RatingComponent implements OnInit, ControlValueAccessor {
  disabled: boolean = false;
  hoverValue!: number;
  propagateChange = (_: any) => { };
  @Input()
  readOnly: boolean = false;
  stars: any[] = [
    { value: 1 },
    { value: 2 },
    { value: 3 },
    { value: 4 },
    { value: 5 }
  ];
  _value!: number;

  constructor() { }

  ngOnInit() {
  }
  get value() {
    return this._value;
  }
  @Input()
  set value(value: any) {
    this._value = value;
    this.propagateChange(this._value);
  }
  registerOnChange(fn: (_: any) => void) {
    this.propagateChange = fn;
  }
  registerOnTouched(fn:  (_: any) => void) {
    //this.propagateChange = fn;
  }
  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
  setRate(value: number, isHover?: boolean) {
    if (isHover) {
      this.hoverValue = value;
    } else {
      this.value = value;
    }
  }
  updateValue(event: any) {
    this.value = event.target.value;
  }
  writeValue(value: string) {
    this.value = value;
  }

}
