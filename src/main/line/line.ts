import P5Lib from 'p5';

import { CanvasContext, CanvasRedrawListener, Color, Coordinate, CoordinateMode, P5Context } from '@batpb/genart';

export class Line implements CanvasRedrawListener {
    #start: Coordinate;
    #end: Coordinate;
    #strokeWeightMultiplier: number = 1;
    #colorA: Color;
    #colorB: Color;

    public constructor(startCoordinate: Coordinate, endCoordinate: Coordinate, color: Color, strokeWeightMultiplier?: number) {
        this.#start = startCoordinate;
        this.#end = endCoordinate;
        this.#colorA = color;
        this.#colorB = color;

        if (strokeWeightMultiplier) {
            this.#strokeWeightMultiplier = strokeWeightMultiplier;
        }
    }

    public set colorA(color: Color) {
        this.#colorA = color;
    }

    public set colorB(color: Color) {
        this.#colorB = color;
    }

    public draw(): void {
        const startX: number = this.#start.getX(CoordinateMode.CANVAS);
        const startY: number = this.#start.getY(CoordinateMode.CANVAS);
        const endX: number = this.#end.getX(CoordinateMode.CANVAS);
        const endY: number = this.#end.getY(CoordinateMode.CANVAS);
        const p5: P5Lib = P5Context.p5;

        p5.strokeWeight(CanvasContext.defaultStroke * this.#strokeWeightMultiplier);
        p5.beginShape(p5.LINES);
        p5.stroke(this.#colorA.color);
        p5.vertex(startX, startY);
        p5.stroke(this.#colorB.color);
        p5.vertex(endX, endY);
        p5.endShape();
    }

    public canvasRedraw(): void {
        this.#start.remap();
        this.#end.remap();
    }
}
