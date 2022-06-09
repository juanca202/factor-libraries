import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FilesService {
  private callback!: Function;
  private fileInput: HTMLInputElement;

  constructor() {
    this.fileInput = document.createElement('input');
    this.fileInput.type = 'file';
    this.fileInput.addEventListener('change', (event: any) => {
      this.loadValue(event.currentTarget.files);
    });
  }
  private loadValue(files: FileList) {
    if (files && files.length > 0) {
      let data: any[] = [];
      for (let i = 0; i < files.length; i++) {
        const file: any = files.item(i);
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
          data.push(Object.assign(file, {
            data: reader.result
          }));
          if (data.length == files.length) {
            this.callback(data.length > 0 ? data : null);
            this.fileInput.value = '';
          }
        };
      }
    }
  }
  public open(callback?: Function, options?: { accept?: string, multiple?: boolean }) {
    this.fileInput.accept = options?.accept ? options.accept : '';
    this.fileInput.multiple = options?.multiple || false;
    this.fileInput.click();
    if (callback) {
      this.callback = callback;
    }
  }
}
