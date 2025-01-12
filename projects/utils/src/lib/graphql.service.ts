import { Injectable, inject } from '@angular/core';
import { Apollo, gql, MutationResult } from 'apollo-angular';
import { lastValueFrom, Observable } from 'rxjs';

import { StringService } from './string.service';

@Injectable({
  providedIn: 'root'
})
export class GraphqlService {
  private apollo = inject(Apollo);
  private stringService = inject(StringService);


  mutation(operation: 'create' | 'update' | 'delete', type: string, entity: any): Promise<unknown> {
    let mutation: Observable<MutationResult<unknown>>;
    const capitalizedType = this.stringService.normalizeName(type);
    switch (operation) {
      case 'create':
        entity.uuid = entity.id ? entity.id.split('/').pop() : crypto.randomUUID();
        delete entity.createdBy;
        delete entity.updatedBy;
        delete entity.id;
        mutation = this.apollo.mutate({
          mutation: gql`
          mutation Create${capitalizedType}($entity: create${capitalizedType}Input!) {
            create${capitalizedType}(input: $entity) {
              ${type} {
                id
              }
            }
          }
        `,
          variables: {
            entity
          }
        });
        break;
      case 'delete':
        mutation = this.apollo.mutate({
          mutation: gql`
          mutation Delete${capitalizedType}($id: ID!) {
            delete${capitalizedType}(input: {id: $id}) {
              clientMutationId
            }
          }
        `,
          variables: {
            id: entity.id
          }
        });
        break;
      case 'update':
        delete entity.createdBy;
        delete entity.updatedBy;
        mutation = this.apollo.mutate({
          mutation: gql`
          mutation Update${capitalizedType}($entity: update${capitalizedType}Input!) {
            update${capitalizedType}(input: $entity) {
              ${type} {
                id
              }
            }
          }
        `,
          variables: {
            entity
          }
        });
        break;
    }
    return lastValueFrom(mutation);
  }
  parseQuery(query: { [key: string]: any }) {
    if (query !== null) {
      const data: any = {};
      for (const property in query) {
        if (query[property]?.edges) {
          data[property] = this.parseEdges(query[property].edges);
        } else if (query[property]?.node) {
          data[property] = this.parseQuery(query[property].node);
        } else if (Array.isArray(query[property])) {
          // Si es un arreglo simple no lo parsea
          if (typeof query[property][0] === 'object') {
            data[property] = query[property].map((node: any) => {
              return this.parseQuery(node);
            });
          } else {
            data[property] = query[property];
          }
        } else if (typeof query[property] === 'object') {
          data[property] = this.parseQuery(query[property]);
        } else if (property !== '__typename') {
          data[property] = query[property];
        }
      }
      return data;
    } else {
      return query;
    }
  }
  parseEdges(edges: any): any[] {
    return edges.map((entity: any) => {
      return this.parseQuery(entity?.node || entity);
    });
  }
}
