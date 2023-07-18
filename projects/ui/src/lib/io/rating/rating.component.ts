import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'ft-rating',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './rating.component.html'
})
export class RatingComponent {
  disabled: boolean = false;
  hoverValue!: number;
  propagateChange = (_: any) => { };
  @Input() readOnly: boolean = false;
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
  @Input() set value(value: any) {
    this._value = value;
    this.propagateChange(this._value);
  }
  registerOnChange(fn: (_: any) => void) {
    this.propagateChange = fn;
  }
  registerOnTouched(fn: (_: any) => void) {
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
