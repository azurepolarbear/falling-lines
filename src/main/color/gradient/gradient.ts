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

import { Color, P5Context } from "@batpb/genart";

// TODO - name change: MappedGradient
// TODO - implement in @batpb/genart library

export interface GradientStep {
    color: Color;
    mapMax: number;
}

// TODO - gradient color should be retrieved from percentage of line length, not from the line length itself

export class Gradient {
    readonly #STEPS: GradientStep[] = [];

    public constructor(steps: GradientStep[]) {
        this.#STEPS.push(...steps);
        this.#STEPS.sort((a: GradientStep, b: GradientStep) => a.mapMax - b.mapMax);
    }

    public get stepTotal(): number {
        return this.#STEPS.length;
    }

    public getMapMax(stepIndex: number): number | undefined {
        if (stepIndex >= 0 && stepIndex < this.#STEPS.length) {
            return this.#STEPS[stepIndex].mapMax;
        }

        return undefined;
    }

    public color(index: number): Color {
        return this.#STEPS[index].color;
    }

    public getColor(value: number): Color {
        let color: Color = new Color();

        if (this.#STEPS.length === 1) {
            color = this.#STEPS[0].color;
        } else if (this.#STEPS.length > 1) {
            let index: number = 0;

            while (index < (this.#STEPS.length - 1) && value > this.#STEPS[index].mapMax) {
                index++;
            }

            console.log(`index: ${index}`);

            if (index === 0) {
                color = this.#STEPS[index].color;
            } else {
                const minValue: number = this.#STEPS[index - 1].mapMax;
                const minColor: Color = this.#STEPS[index - 1].color;
                const maxValue: number = this.#STEPS[index].mapMax;
                const maxColor: Color = this.#STEPS[index].color;
                const percentage: number = P5Context.p5.map(value, minValue, maxValue, 0, 1);
                const c = P5Context.p5.lerpColor(minColor.color, maxColor.color, percentage);
                color = new Color(c);
            }
        }

        return color;
    }
}
