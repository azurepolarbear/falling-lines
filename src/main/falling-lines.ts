import P5Lib from 'p5';

import {
    ASPECT_RATIOS,
    CanvasContext,
    CanvasScreen,
    Color,
    ColorSelector,
    Coordinate,
    CoordinateMapper,
    CoordinateMode,
    P5Context,
    Random,
    Range } from '@batpb/genart';

import { Line } from './line';
import { LineDensity, LineThickness } from './line-categories';
import { CategorySelector } from './selector';

export interface LinesConfig {
    readonly NAME: string;
    readonly THICKNESS_CATEGORY: LineThickness;
    readonly SAME_THICKNESS: boolean;
    readonly COLOR_SELECTOR: ColorSelector;
    readonly LINE_DENSITY?: LineDensity;
}

export class FallingLines extends CanvasScreen {
    static #LINE_DENSITY_SELECTOR: CategorySelector<LineDensity> = new CategorySelector<LineDensity>([
        { category: LineDensity.LOW, range: new Range(5, 15) },
    ], false);

    readonly #LINES: Line[] = [];
    readonly #THICKNESS_CATEGORY: LineThickness;
    readonly #SAME_THICKNESS: boolean;
    readonly #COLOR_SELECTOR: ColorSelector;

    #thickness: number | undefined = undefined;
    #minLineLengthRatio: number = 0.05;
    #maxLineLengthRatio: number = 1;
    #lineTotal: number = 2;

    public constructor(config: LinesConfig) {
        super(config.NAME);
        this.#THICKNESS_CATEGORY = config.THICKNESS_CATEGORY;
        this.#SAME_THICKNESS = config.SAME_THICKNESS;
        this.#COLOR_SELECTOR = config.COLOR_SELECTOR;

        if (config.LINE_DENSITY) {
            FallingLines.#LINE_DENSITY_SELECTOR.currentCategory = config.LINE_DENSITY;
        } else {
            FallingLines.#LINE_DENSITY_SELECTOR.setRandomCategory();
        }

        this.#buildLines();
    }

    protected get colorSelector(): ColorSelector {
        return this.#COLOR_SELECTOR;
    }

    protected get lineTotal(): number {
        return this.#lineTotal;
    }

    protected get minLineLengthRatio(): number {
        return this.#minLineLengthRatio;
    }

    protected get maxLineLengthRatio(): number {
        return this.#maxLineLengthRatio;
    }

    public override draw(): void {
        const p5: P5Lib = P5Context.p5;
        p5.background(0);
        this.#LINES.forEach((line: Line): void => {
            line.draw();
        });
    }

    public override keyPressed(): void {
        const p5: P5Lib = P5Context.p5;

        if (p5.key === '1') {
            CanvasContext.updateAspectRatio(ASPECT_RATIOS.SQUARE);
        } else if (p5.key === '2') {
            CanvasContext.updateAspectRatio(ASPECT_RATIOS.PINTEREST_PIN);
        } else if (p5.key === '3') {
            CanvasContext.updateAspectRatio(ASPECT_RATIOS.TIKTOK_PHOTO);
        } else if (p5.key === '4') {
            CanvasContext.updateAspectRatio(ASPECT_RATIOS.SOCIAL_VIDEO);
        }
    }

    public override mousePressed(): void {
        console.log('mousePressed() placeholder');
    }

    public override publishRedraw(): void {
        this.#LINES.forEach((line: Line): void => {
            line.canvasRedraw();
        });
    }

    public save(): void {
        console.log('save() placeholder');
    }

    public saveColors(): void {
        console.log('saveColors() placeholder');
    }

    public savePalette(): void {
        console.log('savePalette() placeholder');
    }

    public saveSet(): void {
        console.log('saveSet() placeholder');
    }

    #buildLines(): void {
        const p5: P5Lib = P5Context.p5;
        const canvasWidth: number = p5.width;
        const canvasHeight: number = p5.height;
        const minLineLength: number = canvasHeight * this.minLineLengthRatio;
        const maxLineLength: number = canvasHeight * this.maxLineLengthRatio;
        const spaceX: number = canvasWidth / this.lineTotal;
        let startX: number = Random.randomFloat(0, spaceX);

        while (startX < CoordinateMapper.maxX) {
            const startY: number = 0;
            const endX: number = startX;
            const possibleLength: number = maxLineLength;

            // if (this.#maxLength === MaxLength.RIGHT) {
            //     length = p5.map(startX, CoordinateMapper.minX, CoordinateMapper.maxX, minLineLength, maxLineLength);
            // } else if (this.#maxLength === MaxLength.LEFT) {
            //     length = p5.map(startX, CoordinateMapper.minX, CoordinateMapper.maxX, maxLineLength, minLineLength);
            // } else {
            //     possibleLength = maxLineLength;
            // }

            const endY: number = Random.randomFloat(minLineLength, possibleLength);
            const color: Color = this.colorSelector.getColor();
            const start: Coordinate = new Coordinate();
            start.setPosition(new P5Lib.Vector(startX, startY), CoordinateMode.CANVAS);
            const end: Coordinate = new Coordinate();
            end.setPosition(new P5Lib.Vector(endX, endY), CoordinateMode.CANVAS);
            this.#addLine(new Line(start, end, color, this.#getThickness()));
            startX += Random.randomFloat(spaceX * 0.25, spaceX * 1.25);
        }
    }

    #addLine(line: Line): void {
        this.#LINES.push(line);
    }

    #getThickness(): number {
        let result: number;

        if (this.#SAME_THICKNESS) {
            if (!this.#thickness) {
                this.#thickness = this.#calculateThickness();
            }

            result = this.#thickness;
        } else {
            result = this.#calculateThickness();
        }

        return result;
    }

    #calculateThickness(): number {
        switch (this.#THICKNESS_CATEGORY) {
            case LineThickness.THIN:
                return Random.randomFloat(0.5, 2);
            case LineThickness.MEDIUM:
                return Random.randomFloat(2, 10);
            case LineThickness.THICK:
                return Random.randomFloat(10, 30);
        }
    }
}
