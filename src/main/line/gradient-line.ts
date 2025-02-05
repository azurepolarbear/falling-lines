import { Color, Coordinate, CoordinateMode, P5Context } from "@batpb/genart";
import { Line } from "./line";
import { Gradient } from "../color";

import P5Lib from "p5";

export class GradientLine extends Line {
    // readonly #SLICE_TOTAL: number;
    readonly #SEGMENTS: Line[] = [];

    public constructor(startCoordinate: Coordinate,
                       endCoordinate: Coordinate,
                       strokeWeightMultiplier: number,
                       gradient: Gradient,
                       sliceTotal: number) {
        super(startCoordinate, endCoordinate, new Color(255, 0, 0), strokeWeightMultiplier);
        const p5 = P5Context.p5;

        // if (sliceTotal < gradient.stepTotal) {
        //     this.#SLICE_TOTAL = gradient.stepTotal;
        // } else {
        //     this.#SLICE_TOTAL = sliceTotal;
        // }

        console.log(`sliceTotal: ${sliceTotal}`);

        const mode: CoordinateMode = CoordinateMode.CANVAS;
        const start: P5Lib.Vector = p5.createVector(startCoordinate.getX(mode), startCoordinate.getY(mode));

        for (let i = 1; i < gradient.stepTotal; i++) {
            const percentage: number = i / (gradient.stepTotal - 1);
            const end: P5Lib.Vector = p5.createVector(endCoordinate.getX(mode), endCoordinate.getY(mode));
            const endVector: P5Lib.Vector = P5Lib.Vector.lerp(start, end, percentage);
            
            const colorA: Color = gradient.color(i - 1);
            const colorB: Color = gradient.color(i);
            
            const lineStart: Coordinate = new Coordinate();
            lineStart.setX(start.x, mode);
            lineStart.setY(start.y, mode);

            const lineEnd: Coordinate = new Coordinate();
            lineEnd.setX(endVector.x, mode);
            lineEnd.setY(endVector.y, mode);

            const line: Line = new Line(
                lineStart,
                lineEnd,
                colorA,
                strokeWeightMultiplier
            );

            line.colorB = colorB;
            this.#SEGMENTS.push(line);

            start.set(endVector.x, endVector.y);
        }
    }

    public override draw(): void {
        for (const segment of this.#SEGMENTS) {
            segment.draw();
        }
    }
}
