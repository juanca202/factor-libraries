import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StringService {
  decodeHTML(text: string): string {
    const span = document.createElement('span');
    return text.replace(/&[#A-Za-z0-9]+;/gi, (entity) => {
      span.innerHTML = entity;
      return span.innerText;
    });
  }
  /**
   * Normaliza un texto para evitar el Case y los acentos
   * @param text texto a normalizar
   * @returns texto normalizado
   */
  normalize(text: string): string {
    if (!text) return '';
    return text
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
  }
  normalizeName(text: string): string {
    text = text.trim();
    text = text.charAt(0).toUpperCase() + text.slice(1);
    return text;
  }
  /**
   * Te da el tiempo en milisegundos que toma leer un texto dado
   * @param text texto a leer
   * @return number Tiempo en milisegundos
   */
  calculateReadingTime(text: string): number {
    // Caracteres por minuto
    const cpm = 1200;

    // Calcular el número de caracteres en el texto
    const numCharacters: number = text.length;

    // Calcular el tiempo de lectura en minutos
    const readingTimeMinutes: number = numCharacters / cpm;

    // Convertir el tiempo de lectura de minutos a milisegundos
    const readingTimeMilliseconds: number = readingTimeMinutes * 60 * 1000;

    return readingTimeMilliseconds;
  }
}
