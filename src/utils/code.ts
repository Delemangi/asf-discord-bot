import type {CommandInteraction} from 'discord.js';
import assert from 'assert';
import {logger} from './logger';
import {strings} from './strings';
import {config} from '../config';

export function getCode(interaction: CommandInteraction): string {
    if (!config.rustChannels.includes(interaction.channelId)) {
        return strings.invalidChannel;
    } else {
        return generateCode().toString();
    }
}

function generateCode(): number {
    let i: number = 0;

    while (true) {
        const code: number = randomNumber();

        if (checkNumber(code)) {
            logger.debug(`Code generated after ${i} tries`);
            return code;
        }

        i++;
    }
}

function checkNumber(number: number): boolean {
    const d: number[] = getDigits(number);

    try {
        // 4 digits long
        assert(d.length === 4)
        // number in range
        assert(1000 <= number && 9999 >= number);
        // differing neighbouring digits
        assert(d[0] !== d[1] && d[1] !== d[2] && d[1] !== d[2]);
        // differing first and last digit
        assert(d[0] !== d[3]);
        // no repeating digits
        assert(d[0] !== d[2] || d[1] !== d[3]);
        // no common years
        assert(number <= 1900 || number >= 2050);
        // no descending digits
        assert(!(d[0] > d[1] && d[1] > d[2] && d[2] > d[3]));
        // no ascending digits
        assert(!(d[0] < d[1] && d[1] < d[2] && d[2] < d[3]));
        // no corner pattern
        assert(d.sort() !== [1, 3, 7, 9]);
        // no plus pattern
        assert(d.sort() !== [2, 4, 6, 8]);
        // no touching digits
        assert(!isTouching(d[0], d[1]) && !isTouching(d[1], d[2]) && !isTouching(d[2], d[3]));

        return true;
    } catch (e) {
        return false;
    }
}

function randomNumber(min: number = 1000, max: number = 9999): number {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function getDigits(number: number): number[] {
    let digits: number[] = [];

    for (let i = 0; i < 4; i++) {
        digits[i] = parseInt(number.toString()[i]);
    }

    return digits;
}

function isTouching(number: number, digit: number): boolean {
    const touching: { [index: number]: number[] } = {
        0: [2],
        1: [2, 4],
        2: [0, 1, 3, 5],
        3: [2, 6],
        4: [1, 5, 7],
        5: [2, 4, 6, 8],
        6: [3, 5, 9],
        7: [4, 8],
        8: [5, 7, 9],
        9: [6, 8]
    }

    return touching[number].includes(digit);
}
