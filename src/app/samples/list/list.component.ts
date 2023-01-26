import { Component } from '@angular/core';
import { Action } from 'dist/ui/lib/models/action';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent {
  modules: Action[] = [
    {
      "label": "Clientes",
      "iconName": "user-2",
      "class": "ft-list__item--active"
    },
    {
      "label": "Cuentas",
      "iconName": "form"
    },
    {
      "label": "Crédito",
      "iconName": "loan"
    },
    {
      "label": "Inversiones",
      "iconName": "investment"
    },
    {
      "label": "Contabilidad",
      "iconName": "calculator"
    },
    {
      "label": "Administración",
      "iconName": "gear-2"
    },
    {
      "label": "Facturación",
      "iconName": "money-document-2"
    },
    {
      "label": "Proveedores",
      "iconName": "building"
    },
    {
      "label": "Activos fijos",
      "iconName": "money"
    },
    {
      "label": "Cobranzas",
      "iconName": "money-collect"
    },
    {
      "label": "Garantías",
      "iconName": "bank-guarantee"
    },
    {
      "label": "Obligaciones financieras",
      "iconName": "money--minus"
    }
  ];

  handleSelection(action: Action): void {
    console.log(action);
  }
}
