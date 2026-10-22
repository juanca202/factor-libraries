import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { vi } from 'vitest';

import { ObserveIntersecting } from './observe-intersecting';

@Component({
  imports: [ObserveIntersecting],
  template: '<div ftObserveIntersecting (ftObserveIntersecting)="visible = $event"></div>',
})
class TestHost {
  visible: boolean | null = null;
}

describe('ObserveIntersecting', () => {
  let fixture: ComponentFixture<TestHost>;
  const observe = vi.fn();
  const disconnect = vi.fn();

  beforeEach(async () => {
    vi.stubGlobal(
      'IntersectionObserver',
      class {
        public observe = observe;
        public disconnect = disconnect;
      },
    );
    await TestBed.configureTestingModule({ imports: [TestHost] }).compileComponents();
    fixture = TestBed.createComponent(TestHost);
    fixture.detectChanges();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.clearAllMocks();
  });

  it('should observe the host element on init', () => {
    expect(observe).toHaveBeenCalledWith(fixture.nativeElement.querySelector('div'));
  });

  it('should disconnect the observer on destroy', () => {
    fixture.destroy();
    expect(disconnect).toHaveBeenCalled();
  });
});
