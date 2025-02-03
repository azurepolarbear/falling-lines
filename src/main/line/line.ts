import P5Lib from 'p5';

import { CanvasContext, CanvasRedrawListener, Color, Coordinate, CoordinateMode, P5Context } from '@batpb/genart';

export class Line implements CanvasRedrawListener {
    #start: Coordinate;
    #end: Coordinate;
    #strokeWeightMultiplier: number = 1;
    #color: Color;

    public constructor(startCoordinate: Coordinate, endCoordinate: Coordinate, color: Color, strokeWeightMultiplier?: number) {
        this.#start = startCoordinate;
        this.#end = endCoordinate;
        this.#color = color;

        if (strokeWeightMultiplier) {
            this.#strokeWeightMultiplier = strokeWeightMultiplier;
        }
    }

    public draw(): void {
        const startX: number = this.#start.getX(CoordinateMode.CANVAS);
        const startY: number = this.#start.getY(CoordinateMode.CANVAS);
        const endX: number = this.#end.getX(CoordinateMode.CANVAS);
        const endY: number = this.#end.getY(CoordinateMode.CANVAS);
        const p5: P5Lib = P5Context.p5;
        p5.strokeWeight(CanvasContext.defaultStroke * this.#strokeWeightMultiplier);
        p5.stroke(this.#color.color);
        p5.line(startX, startY, endX, endY);
    }

    public canvasRedraw(): void {
        this.#start.remap();
        this.#end.remap();
    }
}
