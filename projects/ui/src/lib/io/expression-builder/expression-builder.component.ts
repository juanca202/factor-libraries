import { Component } from '@angular/core';

@Component({
  selector: 'ft-expression-builder',
  templateUrl: './expression-builder.component.html',
  styleUrls: ['./expression-builder.component.scss']
})
export class ExpressionBuilderComponent {
  properties = [
    { label: 'Nombre', type: 'string', field: 'name' },
    { label: 'Monto', type: 'number', field: 'amount' },
    { label: 'Tarjeta adicional', type: 'boolean', field: 'additional' }
  ];
  groupOperators = [
    { label: 'Y', value: 'AND' },
    { label: 'O', value: 'OR' }
  ];
  filters = {
    id: 'root',
    type: 'group',
    operator: 'AND',
    children: [
      {
        type: 'filter',
        property: '',
        operator: '>',
        value: ''
      },
      {
        type: 'filter',
        property: '',
        operator: true,
        value: ''
      },
      {
        type: 'filter',
        property: '',
        operator: '==',
        value: ''
      },
      {
        type: 'group',
        operator: 'OR',
        children: [
          {
            type: 'filter',
            property: '',
            operator: '==',
            value: ''
          }
        ]
      }
    ]
  };

  constructor() { }

  add(type: string, filter: any): void {
    if (!filter.children) {
      filter.children = [];
    }
    filter.children.push({ type });
    filter.children = filter.children.sort((a: any, b: any) => a.type !== 'group' ? -1 : 0);
  }
  remove(filter: any, parent: any[]): void {
    const index = parent.indexOf(filter);
    parent.splice(index, 1);
  }
}
