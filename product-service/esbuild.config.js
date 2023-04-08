const path = require('path');
const esbuild = require('esbuild');

const functionsDir = `src`
const outDir = `dist`

esbuild.build({
    entryPoints: [
        `${functionsDir}/functions/index.ts`
    ],
    bundle: true,
    external: ['aws-sdk'],
    outdir: path.join(__dirname, outDir),
    outbase: functionsDir,
    platform: 'node',
    minify: false,
    sourcemap: true,
});