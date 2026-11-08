#!/usr/bin/env node
/**
 * Copie les bibliothèques navigateur depuis node_modules vers assets/vendor.
 *
 * Tout est auto-hébergé : aucun CDN tiers (pas de transfert d'adresse IP à
 * Google / jsDelivr / cdnjs, pas de dépendance à leur disponibilité, CSP
 * limitée à 'self'). Les versions sont figées dans package.json.
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const NM = path.join(ROOT, 'node_modules');
const VENDOR = path.join(ROOT, 'assets', 'vendor');

const COPIES = [
    { from: 'maplibre-gl/dist', to: 'maplibre-gl', files: ['maplibre-gl.mjs', 'maplibre-gl-worker.mjs', 'maplibre-gl.css'] },
    { from: 'chart.js/dist', to: 'chart.js', files: ['chart.umd.min.js'] },
    { from: 'html2pdf.js/dist', to: 'html2pdf', files: ['html2pdf.bundle.min.js'] },
    { from: '@fortawesome/fontawesome-free/css', to: 'fontawesome/css', files: ['all.min.css'] },
    { from: '@fortawesome/fontawesome-free/webfonts', to: 'fontawesome/webfonts', pattern: /\.(woff2|ttf)$/ },
    { from: '@fontsource-variable/inter/files', to: 'inter', files: ['inter-latin-wght-normal.woff2', 'inter-latin-ext-wght-normal.woff2'] }
];

let failed = false;
for (const { from, to, files, pattern } of COPIES) {
    const srcDir = path.join(NM, from);
    const outDir = path.join(VENDOR, to);
    if (!fs.existsSync(srcDir)) {
        console.error(`✗ ${from} introuvable — exécutez npm ci dans le dépôt frontend`);
        failed = true;
        continue;
    }
    fs.mkdirSync(outDir, { recursive: true });
    const list = files || fs.readdirSync(srcDir).filter((f) => pattern.test(f));
    for (const file of list) {
        const src = path.join(srcDir, file);
        if (!fs.existsSync(src)) {
            console.error(`✗ fichier manquant : ${src}`);
            failed = true;
            continue;
        }
        fs.copyFileSync(src, path.join(outDir, file));
    }
    console.log(`✓ ${from} → assets/vendor/${to}`);
}

// Ancien build UMD de MapLibre 4 (remplacé par les modules ES de MapLibre 6).
fs.rmSync(path.join(VENDOR, 'maplibre-gl', 'maplibre-gl.js'), { force: true });

if (failed) process.exit(1);
