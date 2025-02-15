/*
 * Copyright (C) 2024-2025 brittni and the polar bear LLC.
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

import { Color, ColorSelector, ColorSelectorType, P5Context, Random, RandomSelector } from '@batpb/genart';

export class HexColorSelector extends ColorSelector {
    public constructor(random: boolean, hexes: string[]) {
        super('hex color selector', random);
        this.#selectColors(hexes, Random.randomBoolean());
    }

    public override get type(): ColorSelectorType {
        return ColorSelectorType.RGB;
    }

    public override getColor(): Color {
        return this.selectColorFromChoices();
    }

    #selectColors(hexes: string[], inOrder: boolean): void {
        const total: number = Random.randomInt(2, hexes.length);

        if (inOrder) {
            for (let i: number = 0; i < total; i++) {
                if (i >= hexes.length) {
                    break;
                }

                const c: Color = new Color(P5Context.p5.color(hexes[i]));
                this.addColorChoice(c);
                this.COLOR_NAMES.add(c.name);
            }
        } else {
            const selector: RandomSelector<string> = new RandomSelector<string>(hexes);

            for (let i: number = 0; i < total; i++) {
                const hex: string | undefined = selector.getRandomElementAndRemove();

                if (hex === undefined) {
                    break;
                }

                const c: Color = new Color(P5Context.p5.color(hex));
                this.addColorChoice(c);
                this.COLOR_NAMES.add(c.name);
            }
        }
    }
}
