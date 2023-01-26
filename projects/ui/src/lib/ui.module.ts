import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { LayoutModule } from '../public-api';
import { IoModule } from './io/io.module';
import { ModuleConfiguration } from './models/module-configuration';
import { NavigationModule } from './navigation/navigation.module';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    IoModule,
    LayoutModule,
    NavigationModule
  ],
  exports: [
    IoModule,
    LayoutModule,
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
