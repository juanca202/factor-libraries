import { Component, HostBinding, Inject, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UiConfiguration } from '../../models/ui-configuration';

@Component({
  selector: 'ft-icon',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './icon.component.html'
})
export class IconComponent {
  _collection!: string;
  _name!: string;
  _mode!: 'inline' | 'external';
  _path!: string;
  @Input() set collection(collection: string) {
    this._collection = collection;
    this.update();
  }
  @Input() set mode(mode: 'inline' | 'external') {
    this._mode = mode;
    this.update();
  }
  @Input() set name(name: string) {
    this._name = name;
    this.update();
  }
  @Input() set path(path: string) {
    this._path = path;
    this.update();
  }
  @Input() src!: string;
  url!: string;

  @Input() class: string = '';
  @HostBinding('class') get hostClasses(): string {
    return [
      'ft-icon',
      this.class
    ].join(' ');
  }

  constructor(
    @Inject('FactorUiConfiguration') private configuration: UiConfiguration
  ) { }

  ngOnInit() {
    this.update();
  }
  private update() {
    // Set the default collection if the mode is external
    if (!this._collection) {
      if (this.configuration.icon && this.configuration.icon.collection) {
        this._collection = this.configuration.icon.collection;
      } else if (this._mode === 'external') {
        this._collection = 'icons';
      }
    }
    if (!this._mode) {
      if (this.configuration.icon && this.configuration.icon.mode) {
        this._mode = this.configuration.icon.mode;
      } else {
        this._mode = 'external';
      }
    }
    if (this._mode === 'external') {
      // If the icon mode is external
      if (!this._path) {
        if (this.configuration.icon && this.configuration.icon.path) {
          this._path = this.configuration.icon.path;
        } else {
          this._path = 'assets';
        }
      }
      this.url = `${this._path}/${this._collection}.svg#${this._name}`;
    } else {
      // If the icon mode is inline
      const name = this._collection && this._collection !== 'unset' ? `${this._collection}--${this._name}` : this._name;
      this.url = `#${name}`;
    }
  }
}
