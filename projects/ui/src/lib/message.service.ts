import { Injectable } from '@angular/core';
import { ReplaySubject, Observable, of } from "rxjs";
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';

import { MessageComponent } from './message/message.component';
import { Content } from './models/content';
import { ContentComponent } from './content/content.component';
import { MessageOptions } from './models/message-options';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  element: any;

  constructor(
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) { }

  show(message: string | Content, options?: MessageOptions): Observable<any> {
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
        this.snackBar.openFromComponent(ContentComponent, {
          data,
          panelClass: ['ft-message', 'ft-message--notification'],
          duration: options.duration || 2000,
        });
        break;
      case 'modal':
        const dialogRef = this.dialog.open(MessageComponent, {
          width: options.width || '350px',
          data,
          panelClass: ['ft-message', 'ft-message--modal'],
          autoFocus: false,
          disableClose: true
        });
        dialogRef.componentInstance.beforeSelect.subscribe(response => {
          selectionSource.next(response);
          dialogRef.close();
        });
        this.snackBar.dismiss();
        break;
    }
    return selection;
  }
}