import { Injectable } from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs';

import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';

import { MessageOptions } from './models/message-options';
import { MessageContent } from './models/message-content';
import { MessageContentComponent } from './io/message-content/message-content.component';
import { MessageDialogComponent } from './io/message-dialog/message-dialog.component';

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
    let selectionSource: ReplaySubject<string> = new ReplaySubject<string>(undefined);
    let selection: Observable<string> = selectionSource.asObservable();
    const defaults: MessageOptions = {
      type: 'notification',
      duration: 2000,
      actionsVisible: true
    };
    options = Object.assign(defaults, options);
    const data = { message: typeof message === 'string' ? { content: message, type: 'text' } : message, options };
    switch (options.type) {
      default:
      case 'notification':
        this.snackBar.openFromComponent(MessageContentComponent, {
          data,
          panelClass: ['ft-message', 'ft-message--notification'],
          duration: options.duration || 2000,
        });
        break;
      case 'modal':
        const dialogRef = this.dialog.open(MessageDialogComponent, {
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
