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
    Range
} from '@batpb/genart';

import { Line } from './line';
import { LineFill, LineLength, LineThickness, LineTransparency } from './line-categories';
import { CategorySelector } from './selector';

export interface LinesConfig {
    readonly NAME: string;
    readonly LINE_TOTAL: number;
    readonly COLOR_SELECTOR: ColorSelector;

    readonly LINE_FILL_CATEGORY: LineFill;

    readonly THICKNESS_CATEGORY?: LineThickness;
    readonly SAME_THICKNESS?: boolean;

    readonly LINE_LENGTH_CATEGORY?: LineLength;

    /**
     * Should the {@link LineLength} {@link CategorySelector} return the same value for all lines?
     */
    readonly SAME_LENGTH?: boolean;

    /**
     * Should all the {@link Line} objects be the same length?
     */
    readonly CONSTANT_LENGTH?: boolean;

    readonly LINE_TRANSPARENCY_CATEGORY?: LineTransparency;
    readonly SAME_TRANSPARENCY?: boolean;
}

export class FallingLines extends CanvasScreen {
    static #LINE_THICKNESS_SELECTOR: CategorySelector<LineThickness> = new CategorySelector<LineThickness>([
        { category: LineThickness.THIN, range: new Range(0.25, 5) },
        { category: LineThickness.THIN_MEDIUM, range: new Range(0.25, 25) },
        { category: LineThickness.MEDIUM, range: new Range(3, 25) },
        { category: LineThickness.THICK, range: new Range(20, 50) },
        { category: LineThickness.MEDIUM_THICK, range: new Range(3, 50) },
        { category: LineThickness.MIXED, range: new Range(0.25, 50) }
    ], false);

    static #LINE_LENGTH_SELECTOR: CategorySelector<LineLength> = new CategorySelector<LineLength>([
        { category: LineLength.SHORT, range: new Range(0.05, 0.35) },
        { category: LineLength.MEDIUM, range: new Range(0.3, 0.7) },
        { category: LineLength.LONG, range: new Range(0.65, 0.9) },
        { category: LineLength.FULL_SCREEN, range: new Range(0.85, 1.1) },
        { category: LineLength.FULL_SCREEN_ONLY, range: new Range(1, 1) },
        { category: LineLength.MIXED, range: new Range(0.05, 1.1) }
    ], false);

    static #LINE_TRANSPARENCY_SELECTOR: CategorySelector<LineTransparency> = new CategorySelector<LineTransparency>([
        { category: LineTransparency.SOLID, range: new Range(255, 255) },
        { category: LineTransparency.LOW_TRANSPARENCY, range: new Range(175, 255) },
        { category: LineTransparency.MEDIUM_TRANSPARENCY, range: new Range(95, 180) },
        { category: LineTransparency.HIGH_TRANSPARENCY, range: new Range(5, 100) },
        { category: LineTransparency.MIXED, range: new Range(5, 255) }
    ], false);

    readonly #LINES: Line[] = [];
    readonly #COLOR_SELECTOR: ColorSelector;

    readonly #CONSTANT_LENGTH: boolean;
    readonly #LINE_FILL: LineFill;

    #lineTotal: number;

    public constructor(config: LinesConfig) {
        super(config.NAME);
        this.#COLOR_SELECTOR = config.COLOR_SELECTOR;
        this.#lineTotal = config.LINE_TOTAL;
        this.#LINE_FILL = config.LINE_FILL_CATEGORY;

        if (typeof config.CONSTANT_LENGTH === 'boolean') {
            this.#CONSTANT_LENGTH = config.CONSTANT_LENGTH;
        } else {
            this.#CONSTANT_LENGTH = Random.randomBoolean();
        }

        this.#initializeLineThicknessSelector(config.THICKNESS_CATEGORY, config.SAME_THICKNESS);
        this.#initializeLineLengthSelector(config.LINE_LENGTH_CATEGORY, config.SAME_LENGTH);
        this.#initializeLineTransparencySelector(config.LINE_TRANSPARENCY_CATEGORY, config.SAME_TRANSPARENCY);

        this.#build(this.#LINE_FILL, this.#CONSTANT_LENGTH);
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
        } else if (p5.key === ' ') {
            this.#logFeatures();
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

    #logFeatures(): void {
        console.log('FallingLines:');

        console.log(`  LINE_TOTAL: ${this.#lineTotal}`);

        console.log(`  LINE_FILL_CATEGORY: ${this.#LINE_FILL}`);

        console.log(`  THICKNESS_CATEGORY: ${FallingLines.#LINE_THICKNESS_SELECTOR.currentCategory}`);
        console.log(`  SAME_THICKNESS: ${FallingLines.#LINE_THICKNESS_SELECTOR.sameChoice}`);

        console.log(`  LINE_LENGTH_CATEGORY: ${FallingLines.#LINE_LENGTH_SELECTOR.currentCategory}`);
        console.log(`  SAME_LENGTH: ${FallingLines.#LINE_LENGTH_SELECTOR.sameChoice}`);
        console.log(`  CONSTANT_LENGTH: ${this.#CONSTANT_LENGTH}`);

        console.log(`  LINE_TRANSPARENCY_CATEGORY: ${FallingLines.#LINE_TRANSPARENCY_SELECTOR.currentCategory}`);
        console.log(`  SAME_TRANSPARENCY: ${FallingLines.#LINE_TRANSPARENCY_SELECTOR.sameChoice}`);
    }

    #initializeLineThicknessSelector(category?: LineThickness, same?: boolean): void {
        if (category) {
            FallingLines.#LINE_THICKNESS_SELECTOR.currentCategory = category;
        } else {
            FallingLines.#LINE_THICKNESS_SELECTOR.setRandomCategory();
        }

        if (typeof same === 'boolean') {
            FallingLines.#LINE_THICKNESS_SELECTOR.sameChoice = same;
        } else {
            FallingLines.#LINE_THICKNESS_SELECTOR.sameChoice = Random.randomBoolean();
        }
    }

    #initializeLineLengthSelector(category?: LineLength, same?: boolean): void {
        if (category) {
            FallingLines.#LINE_LENGTH_SELECTOR.currentCategory = category;
        } else {
            FallingLines.#LINE_LENGTH_SELECTOR.setRandomCategory();
        }

        if (typeof same === 'boolean') {
            FallingLines.#LINE_LENGTH_SELECTOR.sameChoice = same;
        } else {
            FallingLines.#LINE_LENGTH_SELECTOR.sameChoice = Random.randomBoolean();
        }
    }

    #initializeLineTransparencySelector(category?: LineTransparency, same?: boolean): void {
        if (category) {
            FallingLines.#LINE_TRANSPARENCY_SELECTOR.currentCategory = category;
        } else {
            FallingLines.#LINE_TRANSPARENCY_SELECTOR.setRandomCategory();
        }

        if (typeof same === 'boolean') {
            FallingLines.#LINE_TRANSPARENCY_SELECTOR.sameChoice = same;
        } else {
            FallingLines.#LINE_TRANSPARENCY_SELECTOR.sameChoice = Random.randomBoolean();
        }
    }

    #build(fill: LineFill, hasConstantLength: boolean): void {
        switch (fill) {
            case LineFill.EVEN_OVERLAP:
                this.#buildEvenOverlapLines(hasConstantLength);
                break;
            case LineFill.RANDOM_OVERLAP:
                this.#buildRandomOverlapLines(hasConstantLength);
                break;
            default:
                break;
        }
    }

    #buildEvenOverlapLines(hasConstantLength: boolean): void {
        const p5: P5Lib = P5Context.p5;
        const canvasWidth: number = p5.width;
        const spaceX: number = canvasWidth / (this.lineTotal + 1);
        let length: number = this.#getLineLength();

        for (let i = 0; i < this.lineTotal; i++) {
            const x: number = (i + 1) * spaceX;

            if (!hasConstantLength) {
                length = this.#getLineLength();
            }

            const startY: number = 0;
            const endY: number = startY + length;

            const start: Coordinate = new Coordinate();
            start.setPosition(new P5Lib.Vector(x, startY), CoordinateMode.CANVAS);

            const end: Coordinate = new Coordinate();
            end.setPosition(new P5Lib.Vector(x, endY), CoordinateMode.CANVAS);

            const color: Color = this.#getLineColor();
            const thickness: number = FallingLines.#LINE_THICKNESS_SELECTOR.getChoice();
            this.#addLine(new Line(start, end, color, thickness));
        }
    }

    #buildRandomOverlapLines(hasConstantLength: boolean): void {
        const p5: P5Lib = P5Context.p5;
        const canvasWidth: number = p5.width;
        const spaceX: number = canvasWidth / (this.lineTotal + 1);
        let x: number = Random.randomFloat(0, spaceX);
        let total: number = 0;
        let length: number = this.#getLineLength();

        while (x < CoordinateMapper.maxX) {
            if (!hasConstantLength) {
                length = this.#getLineLength();
            }

            const startY: number = 0;
            const endY: number = startY + length;

            const start: Coordinate = new Coordinate();
            start.setPosition(new P5Lib.Vector(x, startY), CoordinateMode.CANVAS);

            const end: Coordinate = new Coordinate();
            end.setPosition(new P5Lib.Vector(x, endY), CoordinateMode.CANVAS);

            const color: Color = this.#getLineColor();

            const thickness: number = FallingLines.#LINE_THICKNESS_SELECTOR.getChoice();
            this.#addLine(new Line(start, end, color, thickness));

            x += Random.randomFloat(spaceX * 0.1, spaceX * 1.5);
            total++;
        }

        this.#lineTotal = total;
    }

    #getLineLength(): number {
        const p5: P5Lib = P5Context.p5;
        const canvasHeight: number = p5.height;
        const lengthRange = FallingLines.#LINE_LENGTH_SELECTOR.getCurrentCategoryRange();

        let minLineLength: number = canvasHeight * FallingLines.MIN_LENGTH_RATIO;
        let maxLineLength: number = canvasHeight * FallingLines.MAX_LENGTH_RATIO;

        // if (this.#maxLength === MaxLength.RIGHT) {
        //     length = p5.map(startX, CoordinateMapper.minX, CoordinateMapper.maxX, minLineLength, maxLineLength);
        // } else if (this.#maxLength === MaxLength.LEFT) {
        //     length = p5.map(startX, CoordinateMapper.minX, CoordinateMapper.maxX, maxLineLength, minLineLength);
        // } else {
        //     possibleLength = maxLineLength;
        // }

        if (lengthRange) {
            minLineLength = canvasHeight * lengthRange.min;
            maxLineLength = canvasHeight * FallingLines.#LINE_LENGTH_SELECTOR.getChoice();
        }

        return Random.randomFloat(minLineLength, maxLineLength);
    }

    #getLineColor(): Color {
        const color: Color = this.#COLOR_SELECTOR.getColor();
        color.alpha = Math.ceil(FallingLines.#LINE_TRANSPARENCY_SELECTOR.getChoice());
        return color;
    }

    #addLine(line: Line): void {
        this.#LINES.push(line);
    }
}
