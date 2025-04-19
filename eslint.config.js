import {
  base,
  node,
  perfectionist,
  prettier,
  typescript,
} from 'eslint-config-imperium';

export default [
  { ignores: ['dist/', 'logs/'] },
  base,
  node,
  typescript,
  prettier,
  perfectionist,
  {
    rules: {
      '@typescript-eslint/restrict-template-expressions': ['off'],
    },
  },
];
