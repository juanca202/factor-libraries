# Fuentes de contexto

- @.agents/MEMORY.md — Preferencias del proyecto
- @docs/adr/README.md — Índice de decisiones arquitectónicas <!-- omitir esta línea y la siguiente si este repositorio está clasificado "Solo specs" (siempre el caso del repositorio de especificaciones en modo multi-repo) — nunca recibe estos índices -->
- @docs/standards/README.md — Índice de estándares de arquitectura
- @README.md — Acerca del proyecto

# Reglas generales

<!-- Normas de trabajo para agentes que no son preferencias (MEMORY), decisiones de arquitectura (ADR/estándares) ni stack: convenciones de código, comandos del repo, restricciones operativas. Ejemplo: "Seguir el estilo del código vecino; no reformatear líneas que no formen parte del cambio." -->

# Stack tecnológico

- **Lenguaje:** TypeScript ~5.9 (strict).
- **Framework:** Angular ^21.2 (standalone, signals), Angular Material/CDK ~21.2, Tailwind CSS 4, D3 7 (`charts`), MSAL (`@azure/msal-angular` ^5, `msal-browser` ^5).
- **Workspace:** monorepo de librerías publicables en `projects/` (`ui`, `utils`, `charts`, `msal`, empaquetadas con ng-packagr 21) y app de demostración en `src/`.
- **Gestor de paquetes/build:** npm 10.8.2; `ng build`, `npm run build:libs`.
- **Calidad:** unit tests con Vitest 4 + jsdom (`ng test`); ESLint con angular-eslint 21 (`npm run lint`, ver `eslint.config.js`); Prettier (`npm run prettier:check`); commitlint (Conventional Commits) y lint-staged vía husky. Sin E2E ni cobertura configurados.
