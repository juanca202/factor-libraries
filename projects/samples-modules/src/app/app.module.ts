import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { UiModule, UI_OPTIONS } from '@factor_ec/ui';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    UiModule
  ],
  providers: [
    {
      provide: UI_OPTIONS,
      useValue: {
        
      }
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
