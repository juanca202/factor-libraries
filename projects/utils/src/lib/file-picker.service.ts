import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FilePickerService {
  private pickerClosed: boolean = false;

  public async open(options?: {
    accept?: string;
    multiple?: boolean;
  }): Promise<any[] | null> {
    return new Promise((resolve, reject) => {
      const fileInput = document.createElement('input');
      fileInput.type = 'file';
      fileInput.addEventListener('change', (event: any) => {
        this.pickerClosed = true;
        const files = event.currentTarget.files;
        if (files && files.length > 0) {
          let data: any[] = [];
          for (let i = 0; i < files.length; i++) {
            const file: any = files.item(i);
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => {
              data.push(
                Object.assign(file, {
                  data: reader.result
                })
              );
              if (data.length == files.length) {
                fileInput.value = '';
                resolve(data.length > 0 ? data : null);
              } else {
                resolve(null);
              }
            };
          }
        }
      });
      this.pickerClosed = false;
      // Detectar cuando el usuario vuelve a la ventana después de abrir el picker
      const onFocus = () => {
        setTimeout(() => {
          if (!this.pickerClosed) {
            reject(null);
          }
          window.removeEventListener('focus', onFocus);
        }, 500); // Esperamos un poco para asegurarnos de que onchange haya tenido oportunidad de ejecutarse
      };
      window.addEventListener('focus', onFocus);
      fileInput.accept = options?.accept ? options.accept : '';
      fileInput.multiple = options?.multiple || false;
      fileInput.click();
    });
  }
}
