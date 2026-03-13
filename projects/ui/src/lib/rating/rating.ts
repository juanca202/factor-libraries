import { Component, ChangeDetectionStrategy, computed, input, output, signal } from '@angular/core';

interface Star {
  value: number;
}

@Component({
  selector: 'ft-rating',
  imports: [],
  templateUrl: './rating.html',
  styleUrl: './rating.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Rating {
  readonly readOnly = input<boolean>(false);
  readonly value = input<number>(0);
  readonly disabled = input<boolean>(false);
  
  readonly valueChange = output<number>();

  readonly stars: Star[] = [
    { value: 1 },
    { value: 2 },
    { value: 3 },
    { value: 4 },
    { value: 5 }
  ];

  readonly hoverValue = signal<number>(0);

  readonly isHovered = computed(() => (starValue: number) => {
    return this.hoverValue() >= starValue;
  });

  readonly isActive = computed(() => (starValue: number) => {
    return this.value() >= starValue;
  });

  readonly iconClasses = computed(() => (starValue: number) => {
    const hovered = this.isHovered()(starValue);
    const active = this.isActive()(starValue);
    
    return {
      'ft-rating__item-icon--hover': hovered,
      'ft-rating__item-icon--active': active
    };
  });

  setRate(value: number, isHover = false): void {
    if (isHover) {
      this.hoverValue.set(value);
    } else {
      this.valueChange.emit(value);
    }
  }

  clearHover(): void {
    this.hoverValue.set(0);
  }
}
