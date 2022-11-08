import { Component, OnInit, ViewChild, ElementRef, forwardRef, Input, HostBinding, Output, EventEmitter } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'ft-searchbox',
  templateUrl: './searchbox.component.html',
  styleUrls: ['./searchbox.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SearchboxComponent),
      multi: true
    }
  ]
})
export class SearchboxComponent implements OnInit {
  /**
   * Clase o clases asignadas al componente
   */
  @ViewChild('input', { static: false })
  input!: ElementRef<any>;
  @ViewChild('inputPlaceholder', { static: false })
  inputPlaceholder!: ElementRef<any>;
  disabled!: boolean;
  private _value!: string;
  private shown!: boolean;
  @Input() placeholder!: string;
  @Output() execute = new EventEmitter<string>();
  @Output() showChange = new EventEmitter<boolean>();

  @Input() class: string = '';
  @HostBinding('class') get hostClasses(): string {
    return [
      'ft-searchbox',
      this.class,
      this.shown ? 'show' : ''
    ].join(' ');
  };

  onChange = (_: any) => { };
  onTouched = (_: any) => { };
  @Input()
  set show(value: boolean) {
    this.shown = value;
    if (value) {
      setTimeout(() => {
        this.getNativeElement().focus();
      }, 300);
    }
  }
  @Input()
  set value(value: any) {
    this._value = value || '';
    this.getNativeElement().value = this._value;
    this.onChange(this._value);
    this.onTouched(this._value);
  }
  get value() {
    return this._value;
  }

  constructor() { }

  ngOnInit(): void {
  }
  closeSearch(): void {
    this.showChange.emit(false);
  }
  getNativeElement() {
    const input = this.placeholder ? this.inputPlaceholder : this.input;
    return input.nativeElement;
  }
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }
  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
  onSearch(event: SubmitEvent): void {
    event.preventDefault();
    this.getNativeElement().value = '';
    this.execute.emit(this._value);
  }
  updateValue(event: any): void {
    this.value = event.target.value;
  }
  writeValue(value: string): void {
    this.value = value;
  }

}
