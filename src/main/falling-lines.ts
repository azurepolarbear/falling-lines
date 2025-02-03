import P5Lib from 'p5';

import {
    ASPECT_RATIOS,
    CanvasContext,
    CanvasScreen,
    Color,
    ColorSelector,
    Coordinate,
    CoordinateMode,
    P5Context,
    Random,
    Range } from '@batpb/genart';

import { Line } from './line';
import { LineFill, LineThickness } from './line-categories';
import { CategorySelector } from './selector';

export interface LinesConfig {
    readonly NAME: string;
    readonly LINE_TOTAL: number;
    readonly COLOR_SELECTOR: ColorSelector;

    readonly LINE_FILL_CATEGORY: LineFill;

    readonly THICKNESS_CATEGORY?: LineThickness;
    readonly SAME_THICKNESS?: boolean;
}

export class FallingLines extends CanvasScreen {
    static #LINE_THICKNESS_SELECTOR: CategorySelector<LineThickness> = new CategorySelector<LineThickness>([
        { category: LineThickness.THIN, range: new Range(0.5, 2) },
        { category: LineThickness.MEDIUM, range: new Range(2, 10) },
        { category: LineThickness.THICK, range: new Range(10, 30) }
    ], false);

    readonly #LINES: Line[] = [];
    readonly #COLOR_SELECTOR: ColorSelector;

    #lineTotal: number = 2;

    public constructor(config: LinesConfig) {
        super(config.NAME);
        this.#COLOR_SELECTOR = config.COLOR_SELECTOR;
        this.#lineTotal = config.LINE_TOTAL;

        if (config.THICKNESS_CATEGORY) {
            FallingLines.#LINE_THICKNESS_SELECTOR.currentCategory = config.THICKNESS_CATEGORY;
        } else {
            FallingLines.#LINE_THICKNESS_SELECTOR.setRandomCategory();
        }

        if (typeof config.SAME_THICKNESS === 'boolean') {
            FallingLines.#LINE_THICKNESS_SELECTOR.sameChoice = config.SAME_THICKNESS;
        } else {
            FallingLines.#LINE_THICKNESS_SELECTOR.sameChoice = Random.randomBoolean();
        }

        this.#build(config.LINE_FILL_CATEGORY);
    }

    public static get MIN_LENGTH_RATIO(): number {
        return 0.02;
    }

    public static get MAX_LENGTH_RATIO(): number {
        return 1.0;
    }

    public get lineTotal(): number {
        return this.#lineTotal;
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

    #build(fill: LineFill): void {
        switch (fill) {
            case LineFill.EVEN_OVERLAP:
                this.#buildEvenOverlapLines();
                break;
            default:
                break;
        }
    }

    #buildEvenOverlapLines(): void {
        const p5: P5Lib = P5Context.p5;
        const canvasWidth: number = p5.width;
        const canvasHeight: number = p5.height;
        const minLineLength: number = canvasHeight * FallingLines.MIN_LENGTH_RATIO;
        const maxLineLength: number = canvasHeight * FallingLines.MAX_LENGTH_RATIO;
        const spaceX: number = canvasWidth / (this.lineTotal + 1);

        for (let i = 0; i < this.lineTotal; i++) {
            const x: number = (i + 1) * spaceX;
            const startY: number = 0;
            const possibleLength: number = maxLineLength;

            // if (this.#maxLength === MaxLength.RIGHT) {
            //     length = p5.map(startX, CoordinateMapper.minX, CoordinateMapper.maxX, minLineLength, maxLineLength);
            // } else if (this.#maxLength === MaxLength.LEFT) {
            //     length = p5.map(startX, CoordinateMapper.minX, CoordinateMapper.maxX, maxLineLength, minLineLength);
            // } else {
            //     possibleLength = maxLineLength;
            // }

            const endY: number = Random.randomFloat(minLineLength, possibleLength);
            const start: Coordinate = new Coordinate();
            start.setPosition(new P5Lib.Vector(x, startY), CoordinateMode.CANVAS);
            const end: Coordinate = new Coordinate();
            end.setPosition(new P5Lib.Vector(x, endY), CoordinateMode.CANVAS);
            const color: Color = this.#COLOR_SELECTOR.getColor();
            const thickness: number = FallingLines.#LINE_THICKNESS_SELECTOR.getChoice();
            this.#addLine(new Line(start, end, color, thickness));
        }
    }

    // #buildLines(): void {
    //     const p5: P5Lib = P5Context.p5;
    //     const canvasWidth: number = p5.width;
    //     const canvasHeight: number = p5.height;
    //     const minLineLength: number = canvasHeight * this.minLineLengthRatio;
    //     const maxLineLength: number = canvasHeight * this.maxLineLengthRatio;
    //     const spaceX: number = canvasWidth / this.lineTotal;
    //     let startX: number = Random.randomFloat(0, spaceX);

    //     while (startX < CoordinateMapper.maxX) {
    //         const startY: number = 0;
    //         const endX: number = startX;
    //         const possibleLength: number = maxLineLength;

    //         // if (this.#maxLength === MaxLength.RIGHT) {
    //         //     length = p5.map(startX, CoordinateMapper.minX, CoordinateMapper.maxX, minLineLength, maxLineLength);
    //         // } else if (this.#maxLength === MaxLength.LEFT) {
    //         //     length = p5.map(startX, CoordinateMapper.minX, CoordinateMapper.maxX, maxLineLength, minLineLength);
    //         // } else {
    //         //     possibleLength = maxLineLength;
    //         // }

    //         const endY: number = Random.randomFloat(minLineLength, possibleLength);
    //         const color: Color = this.colorSelector.getColor();
    //         const start: Coordinate = new Coordinate();
    //         start.setPosition(new P5Lib.Vector(startX, startY), CoordinateMode.CANVAS);
    //         const end: Coordinate = new Coordinate();
    //         end.setPosition(new P5Lib.Vector(endX, endY), CoordinateMode.CANVAS);
    //         this.#addLine(new Line(start, end, color, this.#getThickness()));
    //         startX += Random.randomFloat(spaceX * 0.25, spaceX * 1.25);
    //     }
    // }

    #addLine(line: Line): void {
        this.#LINES.push(line);
    }
}
