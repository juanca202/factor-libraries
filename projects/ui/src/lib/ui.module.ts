import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { DisplayModule } from './display/display.module';

import { InputsModule } from './inputs/inputs.module';
import { ModuleConfiguration } from './models/module-configuration';
import { NavigationModule } from './navigation/navigation.module';

@NgModule({
  declarations: [
    
  ],
  imports: [
    CommonModule,
    DisplayModule,
    InputsModule,
    NavigationModule
  ],
  exports: [
    DisplayModule,
    InputsModule,
    NavigationModule
  ]
})
export class UiModule { 
  public static forRoot(configuration?: ModuleConfiguration): ModuleWithProviders<UiModule> {
    return {
      ngModule: UiModule,
      providers: [
        { provide: 'FactorUiConfiguration', useValue: configuration }
      ]
    };
  }
}
