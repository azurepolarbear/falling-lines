/*
 * Copyright (C) 2025 brittni and the polar bear LLC.
 *
 * This file is a part of azurepolarbear's falling lines algorithmic art project,
 * which is released under the GNU Affero General Public License, Version 3.0.
 * You may not use this file except in compliance with the license.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program. See LICENSE or go to
 * https://www.gnu.org/licenses/agpl-3.0.en.html for full license details.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
 * See the GNU Affero General Public License for more details.
 *
 * The visual outputs of this source code are licensed under the
 * Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International (CC BY-NC-ND 4.0) License.
 * You should have received a copy of the CC BY-NC-ND 4.0 License with this program.
 * See OUTPUT-LICENSE or go to https://creativecommons.org/licenses/by-nc-nd/4.0/
 * for full license details.
 */

import P5Lib from 'p5';

import { Color, P5Context } from '@batpb/genart';

// TODO - implement in @batpb/genart library

/**
 * A step to match a to a portion of the gradient.
 */
export interface GradientStep {
    /**
     * The color to use for this step.
     */
    color: Color;

    /**
     * The maximum percentage of the line length that this color will be used for.
     */
    maxMapPercentage: number;
}

export class MappedGradient {
    readonly #STEPS: GradientStep[] = [];

    public constructor(steps: GradientStep[]) {
        if (steps.length === 0) {
            throw new Error('steps array cannot be empty');
        }

        this.#STEPS.push(...steps);
        this.#STEPS.sort((a: GradientStep, b: GradientStep) => a.maxMapPercentage - b.maxMapPercentage);
    }

    public get stepTotal(): number {
        return this.#STEPS.length;
    }

    public getMapMaxPercentage(stepIndex: number): number | undefined {
        if (stepIndex >= 0 && stepIndex < this.#STEPS.length) {
            return this.#STEPS[stepIndex].maxMapPercentage;
        }

        return undefined;
    }

    public getColor(percentage: number): Color {
        if (this.#STEPS.length === 1) {
            return this.#STEPS[0].color;
        }

        let index: number = 0;
        while ((index < (this.#STEPS.length - 1)) &&
               (percentage > this.#STEPS[index].maxMapPercentage)) {
            index++;
        }

        if (index === 0) {
            return this.#STEPS[index].color;
        }

        const p5: P5Lib = P5Context.p5;
        const minValue: number = this.#STEPS[index - 1].maxMapPercentage;
        const minColor: Color = this.#STEPS[index - 1].color;
        const maxValue: number = this.#STEPS[index].maxMapPercentage;
        const maxColor: Color = this.#STEPS[index].color;
        const colorPercent: number = p5.map(percentage, minValue, maxValue, 0, 1);
        const c: P5Lib.Color = p5.lerpColor(minColor.color, maxColor.color, colorPercent);
        return new Color(c);
    }
}
