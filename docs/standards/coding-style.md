---
name: Coding Style Standards
domain: coding-style
status: Active
last_update: 2026-10-18
source_adrs: [ADR-012]
tags: [typescript, angular, coding-style]
---

# Coding Style Standards

Convenciones de estilo de código TypeScript que aplican a las clases de las librerías de `projects/` (`ui`, `utils`, `charts`, `msal`) y a la aplicación de demostración de `src/`.

## Modificadores de acceso explícitos
**ID:** access-modifiers
**Estado:** Active

Todo miembro de clase (propiedades, métodos y accesores) definido por el desarrollador **DEBE** declarar su modificador de acceso de forma explícita: `public` para la API pública, `private` para detalles de implementación y `protected` para miembros accesibles desde subclases. Las propiedades que no deban cambiar tras su inicialización **DEBERÍAN** declararse `readonly`. Los parámetros del constructor **DEBERÍAN** llevar modificador solo cuando definen una propiedad de instancia, y los constructores **NO DEBEN** llevar `public`.

Los hooks de ciclo de vida de Angular (`ngOnInit`, `ngOnDestroy`, `ngOnChanges`, etc.) **NO DEBEN** llevar el modificador `public` explícito.

### Excepciones
Los hooks de ciclo de vida de Angular, como se indica arriba.

## Criterios de cumplimiento

| ID | Requisito | Descripción | Automatizable | Enfoque | Verificación |
|----|-----------|-------------|---------------|---------|--------------|
| CR-001 | access-modifiers | La configuración de lint **DEBE** tener activa la regla de modificador de acceso explícito (`@typescript-eslint/explicit-member-accessibility`) sobre las fuentes de las librerías, excluyendo los hooks de ciclo de vida | yes | warning | [checks/coding-style.mjs](../../scripts/arch/checks/coding-style.mjs) |
| CR-002 | access-modifiers | La configuración de lint **DEBERÍA** tener activa la regla que exige `readonly` en propiedades que no se reasignan (`@typescript-eslint/prefer-readonly`) sobre las fuentes de las librerías; la regla cubre miembros `private` | yes | warning | [checks/coding-style.mjs](../../scripts/arch/checks/coding-style.mjs) |

## Referencias

- [ADR-012: Convención de modificadores de acceso y uso de `readonly` en TypeScript](../adr/ADR-012-modificadores-acceso-readonly.md)
