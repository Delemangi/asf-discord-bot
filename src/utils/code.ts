import assert from 'assert';
import type {CommandInteraction} from 'discord.js';
import {config} from '../config';
import {logger} from './logger';
import {strings} from './strings';

export function getCode (interaction: CommandInteraction): string {
  if (config.rustChannels.includes(interaction.channelId)) {
    return generateCode().toString();
  }

  return strings.invalidChannel;
}

function generateCode (): number {
  let index: number = 0;

  while (true) {
    const code: number = randomNumber();

    if (checkNumber(code)) {
      logger.debug(`Code ${code} generated after ${index} attempts`);
      return code;
    }

    index++;
  }
}

function checkNumber (number: number): boolean {
  const digits: number[] = getDigits(number);

  try {
    // 4 digits long
    assert(digits.length === 4);
    // number in range
    assert(number >= 1_000 && number <= 9_999);
    // differing neighbouring digits
    assert(digits[0] !== digits[1] && digits[1] !== digits[2] && digits[1] !== digits[2]);
    // differing first and last digit
    assert(digits[0] !== digits[3]);
    // no repeating digits
    assert(digits[0] !== digits[2] || digits[1] !== digits[3]);
    // no common years
    assert(number <= 1_900 || number >= 2_050);
    // no descending digits
    assert(!(digits[0] > digits[1] && digits[1] > digits[2] && digits[2] > digits[3]));
    // no ascending digits
    assert(!(digits[0] < digits[1] && digits[1] < digits[2] && digits[2] < digits[3]));
    // no corner pattern
    assert(digits.sort() !== [1, 3, 7, 9]);
    // no plus pattern
    assert(digits.sort() !== [2, 4, 6, 8]);
    // no touching digits
    assert(!isTouching(digits[0], digits[1]) && !isTouching(digits[1], digits[2]) && !isTouching(digits[2], digits[3]));

    return true;
  } catch {
    return false;
  }
}

function randomNumber (min: number = 1_000, max: number = 9_999): number {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function getDigits (number: number): number[] {
  const digits: number[] = [];

  for (let index = 0; index < 4; index++) {
    digits[index] = Number.parseInt(number.toString()[index], 10);
  }

  return digits;
}

function isTouching (number: number, digit: number): boolean {
  const touching: { [index: number]: number[] } = [
    [2],
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

  return touching[number].includes(digit);
}
