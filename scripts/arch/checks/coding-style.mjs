#!/usr/bin/env node
// =============================================================================
// Fitness functions del estándar Coding Style Standards — checks/coding-style.mjs
// -----------------------------------------------------------------------------
// UN archivo por ESTÁNDAR (docs/standards/coding-style.md). Cada chequeo traza a su
// criterio de cumplimiento (CR-XXX) en la línea de salida y en un comentario.
// Contrato: imprime `PASS|FAIL|WARN coding-style/CR-XXX — detalle`; sale ≠ 0 solo si
// falla un CR bloqueante.
// =============================================================================
import { execSync } from 'node:child_process';
import { colorStatus } from '../lib/colors.mjs';

const STANDARD = 'coding-style';
let blockingFailures = 0;

function check(cr, enfoque, descripcion, fn) {
  try {
    fn();
    console.log(`${colorStatus('PASS')} ${STANDARD}/${cr} — ${descripcion}`);
  } catch (err) {
    const status = enfoque === 'warning' ? 'WARN' : 'FAIL';
    if (status === 'FAIL') blockingFailures += 1;
    console.log(`${colorStatus(status)} ${STANDARD}/${cr} — ${descripcion}`);
    const detail = err?.stdout?.toString?.() || err?.message || '';
    if (detail) console.log(detail.trim().split('\n').map((l) => `     ${l}`).join('\n'));
  }
}

const run = (cmd) => execSync(cmd, { stdio: 'pipe', encoding: 'utf8' });

// Verifica la configuración efectiva de ESLint para un archivo (no ejecuta el lint:
// las violaciones vivas las reporta `npm run lint`).
function effectiveRule(file, rule) {
  const config = JSON.parse(run(`npx --no-install eslint --print-config ${file}`));
  return config.rules?.[rule];
}

// --- CR-001 (warning) --------------------------------------------------------
// Todo miembro de clase DEBE declarar modificador de acceso explícito, salvo los hooks de
// ciclo de vida de Angular. Audita que la regla esté registrada como warn/error en las
// fuentes de las librerías [regla @typescript-eslint: explicit-member-accessibility].
check('CR-001', 'warning', 'regla de modificador de acceso explícito activa [regla @typescript-eslint: explicit-member-accessibility]', () => {
  const files = [
    'projects/ui/src/lib/message-service.ts',
    'projects/utils/src/lib/storage.ts',
    'projects/charts/src/lib/chart-renderer.ts',
    'projects/msal/src/lib/auth-service.ts',
  ];
  const off = files.filter((f) => {
    const entry = effectiveRule(f, '@typescript-eslint/explicit-member-accessibility');
    const severity = Array.isArray(entry) ? entry[0] : entry;
    return !['warn', 'error', 1, 2].includes(severity);
  });
  if (off.length > 0) throw new Error(`Regla desactivada o ausente en: ${off.join(', ')}`);
});

// --- CR-002 (warning) --------------------------------------------------------
// Las propiedades que no mutan tras inicializarse DEBERÍAN ser readonly. Audita que la regla
// esté registrada como warn/error [regla @typescript-eslint: prefer-readonly]; cubre miembros
// `private` (límite de la regla). Las violaciones vivas las reporta `npm run lint`.
check('CR-002', 'warning', 'regla de readonly en propiedades no mutadas activa [regla @typescript-eslint: prefer-readonly]', () => {
  const files = [
    'projects/ui/src/lib/message-service.ts',
    'projects/utils/src/lib/storage.ts',
    'projects/charts/src/lib/chart-renderer.ts',
    'projects/msal/src/lib/auth-service.ts',
  ];
  const off = files.filter((f) => {
    const entry = effectiveRule(f, '@typescript-eslint/prefer-readonly');
    const severity = Array.isArray(entry) ? entry[0] : entry;
    return !['warn', 'error', 1, 2].includes(severity);
  });
  if (off.length > 0) throw new Error(`Regla desactivada o ausente en: ${off.join(', ')}`);
});

process.exit(blockingFailures > 0 ? 1 : 0);
