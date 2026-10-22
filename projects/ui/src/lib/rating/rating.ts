import { Component, ChangeDetectionStrategy, computed, input, output, signal } from '@angular/core';

interface Star {
  value: number;
}

/**
 * Five-star rating control.
 *
 * @remarks
 * Selector: `ft-rating`. Stars up to `value` are shown as active and stars up to the hovered one as hovered.
 * Selecting a star emits `valueChange`; the component does not update `value` by itself.
 *
 * @example
 * ```html
 * <ft-rating [value]="rating" (valueChange)="rating = $event" />
 * ```
 */
@Component({
  selector: 'ft-rating',
  imports: [],
  templateUrl: './rating.html',
  styleUrl: './rating.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Rating {
  /**
   * Whether the rating is read-only.
   *
   * @defaultValue `false`
   */
  readonly readOnly = input<boolean>(false);
  /**
   * Current rating (0-5).
   *
   * @defaultValue `0`
   */
  readonly value = input<number>(0);
  /**
   * Whether the rating is disabled.
   *
   * @defaultValue `false`
   */
  readonly disabled = input<boolean>(false);
  
  /** Emits the selected star value (1-5) when the user picks a rating. */
  readonly valueChange = output<number>();

  /** The five stars rendered by the component. */
  readonly stars: Star[] = [
    { value: 1 },
    { value: 2 },
    { value: 3 },
    { value: 4 },
    { value: 5 }
  ];

  /** Value of the star currently hovered (0 when none). */
  readonly hoverValue = signal<number>(0);

  /** Returns a function telling whether a star is highlighted by hover. */
  readonly isHovered = computed(() => (starValue: number) => {
    return this.hoverValue() >= starValue;
  });

  /** Returns a function telling whether a star is within the current `value`. */
  readonly isActive = computed(() => (starValue: number) => {
    return this.value() >= starValue;
  });

  /** Returns a function that builds the hover/active CSS classes for a star. */
  readonly iconClasses = computed(() => (starValue: number) => {
    const hovered = this.isHovered()(starValue);
    const active = this.isActive()(starValue);
    
    return {
      'ft-rating__item-icon--hover': hovered,
      'ft-rating__item-icon--active': active
    };
  });

  /**
   * Handles a star interaction.
   *
   * @param value - Star value (1-5)
   * @param isHover - When `true` only updates the hover state; otherwise emits `valueChange`
   */
  setRate(value: number, isHover = false): void {
    if (isHover) {
      this.hoverValue.set(value);
    } else {
      this.valueChange.emit(value);
    }
  }

  /** Resets the hover state. */
  clearHover(): void {
    this.hoverValue.set(0);
  }
}
