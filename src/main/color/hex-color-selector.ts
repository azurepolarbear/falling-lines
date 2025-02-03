import P5Lib from 'p5';

import { Color, ColorSelector, ColorSelectorType, P5Context } from '@batpb/genart';

export class HexColorSelector extends ColorSelector {
    public constructor(random: boolean, hexes: string[]) {
        super('hex color selector', random);
        const p5: P5Lib = P5Context.p5;

        for (const hex of hexes) {
            const c: Color = new Color(p5.color(hex));
            this.addColorChoice(c);
        }
    }

    public override get type(): ColorSelectorType {
        return ColorSelectorType.RGB;
    }

    public override getColor(): Color {
        return this.selectColorFromChoices();
    }
}
