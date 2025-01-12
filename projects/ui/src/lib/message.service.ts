import { Component, EventEmitter, Injectable, Output, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MAT_SNACK_BAR_DATA, MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { MatButtonModule } from '@angular/material/button';

import { Observable, ReplaySubject } from 'rxjs';
import { IconComponent } from './icon/icon.component';
import { MessageOptions } from './models/message-options';
import { MessageContent } from './models/message-content';
import { StringService } from '@factor_ec/utils';
import { CommonModule } from '@angular/common';

@Component({
    standalone: true,
    imports: [
        MatSnackBarModule
    ],
    template: `
@switch (data.message?.type) {
  @case ('html') {
    <div [innerHTML]="data.message?.content"></div>
  }
  @default {
    {{ data.message?.content }}
  }
}
`
})
export class MessageContentComponent {
  data = inject(MAT_SNACK_BAR_DATA);
}

@Component({
    standalone: true,
    imports: [
        CommonModule,
        MatButtonModule,
        MatDialogModule,
        IconComponent
    ],
    template: `
  @if (data.options?.title) {
    <h1 mat-dialog-title class="ft-message__title">
      @if (data.options?.titleIcon) {
        <ft-icon [name]="data.options?.titleIcon?.name"
        [collection]="data.options?.titleIcon?.collection" [ngClass]="data.options?.titleIcon?.class"></ft-icon>
      }
      <div>{{ data.options?.title }}</div>
    </h1>
  }
  <div mat-dialog-content class="ft-message__content" [ngClass]="data.options?.class">
    @if (data.options?.icon) {
      <ft-icon [name]="data.options?.icon?.name" [collection]="data.options?.icon?.collection"
      [ngClass]="data.options?.icon?.class"></ft-icon>
    }
    @switch (data.message?.type) {
      @case ('html') {
        <div [innerHTML]="data.message?.content"></div>
      }
      @default {
        {{ data.message?.content }}
      }
    }
  </div>
  @if (data.options.actionsVisible) {
    <div mat-dialog-actions class="ft-message__actions">
      @if (data.options?.actions?.length > 0) {
        @for (action of data.options?.actions; track action; let i = $index) {
          @switch (action.type) {
            @case ('raised') {
              <button type="button" mat-raised-button [color]="action.metadata?.color"
              (click)="select(action.value)">{{ action.label }}</button>
            }
            @case ('flat') {
              <button type="button" mat-flat-button [color]="action.metadata?.color"
              (click)="select(action.value)">{{ action.label }}</button>
            }
            @case ('stroked') {
              <button type="button" mat-stroked-button [color]="action.metadata?.color"
              (click)="select(action.value)">{{ action.label }}</button>
            }
            @default {
              <button type="button" mat-button (click)="select(action.value)">{{ action.label }}</button>
            }
          }
        }
      } @else {
        <button type="button" mat-flat-button color="primary" (click)="select('-1')" i18n>Accept</button>
      }
    </div>
  }
  `
})
export class MessageDialogComponent {
  data = inject(MAT_DIALOG_DATA);

  @Output() beforeSelect: EventEmitter<any> = new EventEmitter();

  select(value: string) {
    this.beforeSelect.emit(value);
  }
}

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  private snackBar = inject(MatSnackBar);
  private dialog = inject(MatDialog);
  private stringService = inject(StringService);


  show(message: string | MessageContent, options?: MessageOptions): Observable<any> {
    const selectionSource: ReplaySubject<string> = new ReplaySubject<string>(undefined);
    const selection: Observable<string> = selectionSource.asObservable();
    const defaults: MessageOptions = {
      type: 'notification',
      duration: 2000,
      actionsVisible: true
    };
    options = Object.assign(defaults, options);
    const data = { message: typeof message === 'string' ? { content: message, type: 'text' } : message, options };
    let dialogRef: MatDialogRef<MessageDialogComponent>;
    switch (options.type) {
      default:
      case 'notification':
        this.snackBar.openFromComponent(MessageContentComponent, {
          data,
          panelClass: ['ft-message', 'ft-message--notification'],
          duration: this.stringService.calculateReadingTime(typeof message === 'string' ? message : message.content),
          verticalPosition: options.verticalPosition || 'bottom'
        });
        break;
      case 'modal':
        dialogRef = this.dialog.open(MessageDialogComponent, {
          width: options.width || '350px',
          data,
          panelClass: ['ft-message', 'ft-message--modal'],
          autoFocus: false,
          disableClose: true
        });
        dialogRef.componentInstance.beforeSelect.subscribe((response: any) => {
          selectionSource.next(response);
          dialogRef.close();
        });
        break;
    }
    return selection;
  }
}
