import {
  base,
  node,
  perfectionist,
  prettier,
  typescript,
} from 'eslint-config-imperium';

const config = [
  { ignores: ['dist/', 'logs/'] },
  ...base,
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

export default config;
