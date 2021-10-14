import babel from 'rollup-plugin-babel'
import commonjs from '@rollup/plugin-commonjs'
import external from 'rollup-plugin-peer-deps-external'
import resolve from '@rollup/plugin-node-resolve'
import visualizer from 'rollup-plugin-visualizer'
import pkg from './package.json'
import cleaner from 'rollup-plugin-cleaner'

export default {
  input: './src/Alert.js',
  output: [
    {
      file: pkg.main,
      format: 'cjs',
    },
    {
      file: pkg.module,
      format: 'esm',
    },
  ],
  plugins: [
    external(),
    babel({
      exclude: 'node_modules/**',
    }),
    resolve(),
    commonjs(),
    visualizer(),
    cleaner({
      targets: ['./dist/'],
    }),
  ],
}
