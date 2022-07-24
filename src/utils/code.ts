import assert from 'node:assert';
import {logger} from './logger.js';

export function generateCode (): number {
  let index = 0;

  while (true) {
    const code = randomNumber();

    if (checkNumber(code)) {
      logger.debug(`Code ${code} generated after ${index} attempts`);
      return code;
    }

    index++;
  }
}

function checkNumber (number: number): boolean {
  const digits = getDigits(number);
  const [d1, d2, d3, d4] = digits;

  try {
    // none undefined, for type safety
    assert(d1 !== undefined);
    assert(d2 !== undefined);
    assert(d3 !== undefined);
    assert(d4 !== undefined);

    // number in range
    assert(number >= 1_000 && number <= 9_999);
    // differing neighbouring digits
    assert(d1 !== d2 && d2 !== d3 && d2 !== d3);
    // differing first and last digit
    assert(d1 !== d4);
    // no repeating digits
    assert(d1 !== d3 || d2 !== d4);
    // no common years
    assert(number <= 1_900 || number >= 2_050);
    // no descending digits
    assert(!(d1 > d2 && d2 > d3 && d3 > d4));
    // no ascending digits
    assert(!(d1 < d2 && d2 < d3 && d3 < d4));

    digits.sort((a, b) => a - b);

    // no corner pattern
    assert(digits.join('') !== '1379');
    // no plus pattern
    assert(digits.join('') !== '2468');
    // no touching digits
    assert(!isTouching(d1, d2) && !isTouching(d2, d3) && !isTouching(d3, d4));

    return true;
  } catch {
    return false;
  }
}

function randomNumber (min: number = 1_000, max: number = 9_999): number {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function getDigits (number: number): number[] {
  return Array.from(String(number), Number);
}

function isTouching (number: number, digit: number): boolean {
  const touching = [
    [1, 2],
    [2, 4],
    [0, 1, 3, 5],
    [2, 6],
    [1, 5, 7],
    [2, 4, 6, 8],
    [3, 5, 9],
    [4, 8],
    [5, 7, 9],
    [6, 8]
  ];

  return (touching[number] ?? []).includes(digit);
}
