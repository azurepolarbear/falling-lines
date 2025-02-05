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

import { GradientLine, Line } from './line';
import { LineFill, LineLength, LineThickness, LineTransparency, LineTrend } from './line-categories';
import { CategorySelector } from './selector';
import { Gradient } from './color';

export interface LinesConfig {
    readonly NAME: string;
    readonly LINE_TOTAL: number;
    readonly COLOR_SELECTOR: ColorSelector;

    readonly LINE_FILL_CATEGORY: LineFill;
    readonly LINE_TREND_CATEGORY: LineTrend;

    readonly THICKNESS_CATEGORY?: LineThickness;
    readonly SAME_THICKNESS?: boolean;

    readonly LINE_LENGTH_CATEGORY?: LineLength;
    readonly SAME_LENGTH?: boolean;

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

    readonly #LINE_FILL: LineFill;
    readonly #LINE_TREND: LineTrend;

    #lineTotal: number;

    public constructor(config: LinesConfig) {
        super(config.NAME);
        this.#COLOR_SELECTOR = config.COLOR_SELECTOR;
        this.#lineTotal = config.LINE_TOTAL;
        this.#LINE_FILL = config.LINE_FILL_CATEGORY;
        this.#LINE_TREND = config.LINE_TREND_CATEGORY;

        this.#initializeLineThicknessSelector(config.THICKNESS_CATEGORY, config.SAME_THICKNESS);
        this.#initializeLineLengthSelector(config.LINE_LENGTH_CATEGORY, config.SAME_LENGTH);
        this.#initializeLineTransparencySelector(config.LINE_TRANSPARENCY_CATEGORY, config.SAME_TRANSPARENCY);

        this.#build();
    }

    public static get MIN_LENGTH_RATIO(): number {
        return 0.02;
    }

    public static get MAX_LENGTH_RATIO(): number {
        return 1.0;
    }

    public static get MIN_X(): number {
        return CoordinateMapper.minX;
    }

    public static get MAX_X(): number {
        return CoordinateMapper.maxX;
    }

    public static get MIN_Y(): number {
        return CoordinateMapper.minY;
    }

    public static get MAX_Y(): number {
        return CoordinateMapper.maxY;
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

    #build(): void {
        switch (this.#LINE_FILL) {
            case LineFill.EVEN_OVERLAP:
                this.#buildEvenOverlapLines();
                break;
            case LineFill.RANDOM_OVERLAP:
                this.#buildRandomOverlapLines();
                break;
            default:
                break;
        }
    }

    #buildEvenOverlapLines(): void {
        const p5: P5Lib = P5Context.p5;
        const canvasWidth: number = p5.width;
        const spaceX: number = canvasWidth / (this.lineTotal + 1);

        for (let i = 0; i < this.lineTotal; i++) {
            const x: number = ((i + 1) * spaceX) + FallingLines.MIN_X;
            length = this.#getLineLength(x);

            const startY: number = FallingLines.MIN_Y;
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

    #buildRandomOverlapLines(): void {
        const p5: P5Lib = P5Context.p5;
        const canvasWidth: number = p5.width;
        const spaceX: number = canvasWidth / (this.lineTotal + 1);
        let x: number = Random.randomFloat(FallingLines.MIN_X, FallingLines.MIN_X + spaceX);
        let total: number = 0;

        while (x < CoordinateMapper.maxX) {
            length = this.#getLineLength(x);
            const startY: number = FallingLines.MIN_Y;
            const endY: number = startY + length;

            const start: Coordinate = new Coordinate();
            start.setPosition(new P5Lib.Vector(x, startY), CoordinateMode.CANVAS);

            const end: Coordinate = new Coordinate();
            end.setPosition(new P5Lib.Vector(x, endY), CoordinateMode.CANVAS);

            // const color: Color = this.#getLineColor();

            const thickness: number = FallingLines.#LINE_THICKNESS_SELECTOR.getChoice();
            this.#addLine(this.#buildLine(start, end, thickness));

            x += Random.randomFloat(spaceX * 0.1, spaceX * 1.5);
            total++;
        }

        this.#lineTotal = total;
    }

    #getLineLength(x: number): number {
        const p5: P5Lib = P5Context.p5;
        const canvasHeight: number = p5.height;
        const minLineLength: number = canvasHeight * FallingLines.MIN_LENGTH_RATIO;
        let length: number = canvasHeight * FallingLines.#LINE_LENGTH_SELECTOR.getChoice();

        if (this.#LINE_TREND === LineTrend.INCREASE_TO_LEFT) {
            length = p5.map(x, FallingLines.MIN_X, FallingLines.MAX_X, length, minLineLength);
        } else if (this.#LINE_TREND === LineTrend.INCREASE_TO_RIGHT) {
            length = p5.map(x, FallingLines.MIN_X, FallingLines.MAX_X, minLineLength, length);
        }

        return length;
    }

    #getLineColor(): Color {
        const color: Color = this.#COLOR_SELECTOR.getColor();
        color.alpha = Math.ceil(FallingLines.#LINE_TRANSPARENCY_SELECTOR.getChoice());
        return color;
    }

    #buildLine(start: Coordinate, end: Coordinate, strokeWeightMultiplier: number): Line {
        const gradient: Gradient = new Gradient([
            { color: new Color(255, 0, 0, 50), mapMax: 0 },
            { color: new Color(0, 255, 0, 50), mapMax: CoordinateMapper.maxY * 0.33 },
            { color: new Color(255, 255, 0, 50), mapMax: CoordinateMapper.maxY * 0.66 },
            { color: new Color(0, 0, 255, 50), mapMax: CoordinateMapper.maxY },
        ]);

        return new GradientLine(start, end, strokeWeightMultiplier, gradient, 3);
    }

    #addLine(line: Line): void {
        this.#LINES.push(line);
    }
}
