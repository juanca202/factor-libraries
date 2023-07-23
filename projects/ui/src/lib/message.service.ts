import { Injectable } from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs';

import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

import { MessageOptions } from './models/message-options';
import { MessageContent } from './models/message-content';
import { MessageContentComponent } from './message-content/message-content.component';
import { MessageDialogComponent } from './message-dialog/message-dialog.component';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  element: any;

  constructor(
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) { }

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
          panelClass: ['ft-message', 'ft-message--notification', options.class || ''],
          duration: options.duration || 2000,
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
        this.snackBar.dismiss();
        break;
    }
    return selection;
  }
}
