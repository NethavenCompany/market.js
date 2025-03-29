import typescript from '@rollup/plugin-typescript';
import { nodeResolve } from '@rollup/plugin-node-resolve';

export default {
  input: 'mod.ts',
  output: {
    file: 'dist/mod.js',
    format: 'es',
    sourcemap: true
  },
  plugins: [
    nodeResolve(),
    typescript({
      tsconfig: './tsconfig.json',
      sourceMap: true,
      declaration: true,
      declarationMap: true,
      outDir: './dist'
    })
  ]
}; 