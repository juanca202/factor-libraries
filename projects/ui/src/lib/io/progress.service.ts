import { ApplicationRef, ComponentRef, EmbeddedViewRef, Injectable, Injector, ViewContainerRef } from '@angular/core';
import { ProgressComponent } from './progress/progress.component';

@Injectable({
  providedIn: 'root'
})
export class ProgressService {
  appRef!: ApplicationRef;
  componentRef!: ComponentRef<ProgressComponent> | null;
  domElem!: HTMLElement;

  constructor(
    private viewContainerRef: ViewContainerRef,
    private injector: Injector
  ) { }

  show(): boolean {
    if (!this.componentRef) {
      this.appRef = this.injector.get(ApplicationRef);
      // 1. Create a component reference from the component 
      this.componentRef = this.viewContainerRef.createComponent(ProgressComponent);

      // 2. Attach component to the appRef so that it's inside the ng component tree
      this.appRef.attachView(this.componentRef.hostView);
      this.componentRef.instance.overlay = true;

      // 3. Get DOM element from component
      const domElem = (this.componentRef.hostView as EmbeddedViewRef<any>)
        .rootNodes[0] as HTMLElement;

      // 4. Append DOM element to the body
      document.body.appendChild(domElem);
      return true;
    } else {
      return false;
    }
  }
  hide(): boolean {
    if (this.componentRef) {
      this.appRef.detachView(this.componentRef.hostView);
      this.componentRef.destroy();
      this.componentRef = null;
      return true;
    } else {
      return false;
    }
  }
}
