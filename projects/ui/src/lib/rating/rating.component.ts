import { Component, Input, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'ft-rating',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './rating.component.html',
  styleUrl: './rating.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: RatingComponent,
      multi: true
    }
  ]
})
export class RatingComponent implements ControlValueAccessor {
  disabled: boolean = false;
  hoverValue!: number;
  propagateChange = (_: any) => { };
  readonly readOnly = input<boolean>(false);
  stars: any[] = [
    { value: 1 },
    { value: 2 },
    { value: 3 },
    { value: 4 },
    { value: 5 }
  ];
  _value!: number;

  get value() {
    return this._value;
  }
  // TODO: Skipped for migration because:
  //  Accessor inputs cannot be migrated as they are too complex.
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