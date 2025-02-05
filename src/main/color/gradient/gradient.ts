import { Color, P5Context } from "@batpb/genart";

// TODO - implement in @batpb/genart library

export interface GradientStep {
    color: Color;
    mapMax: number;
}

export class Gradient {
    readonly #STEPS: GradientStep[] = [];

    public constructor(steps: GradientStep[]) {
        this.#STEPS.push(...steps);
        this.#STEPS.sort((a: GradientStep, b: GradientStep) => a.mapMax - b.mapMax);
    }

    public get stepTotal(): number {
        return this.#STEPS.length;
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
