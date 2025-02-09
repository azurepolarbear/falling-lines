/*
 * Copyright (C) 2025 brittni and the polar bear LLC.
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

import { CanvasContext, Color, Coordinate, CoordinateMode, P5Context, Random } from '@batpb/genart';

import { Line } from './line';
import { MappedGradient } from '../color';
import { buildCoordinate, buildVector } from '../utils';

// TODO - implement functionality in @batpb/genart library
// TODO - segments based on given segment total

export enum LineRenderMode {
    VERTICES = 'vertices',
    SEGMENTS = 'segments',
    RANDOM = 'random'
}

export interface GradientLineConfig {
    readonly RENDER_MODE: LineRenderMode;
}

export class VerticalGradientLine extends Line {
    readonly #SEGMENTS: Line[] = [];
    readonly #VERTICES: { coordinate: Coordinate; color: Color; }[] = [];
    readonly #RENDER_MODE: LineRenderMode;

    readonly #GRADIENT: MappedGradient;

    #minGradientY: number = 0;
    #maxGradientY: number = 0;

    public constructor(startCoordinate: Coordinate,
                       endCoordinate: Coordinate,
                       strokeWeightMultiplier: number,
                       gradient: MappedGradient,
                       renderMode: LineRenderMode,
                       minGradientY?: number,
                       maxGradientY?: number
    ) {
        super(startCoordinate, endCoordinate, strokeWeightMultiplier);

        if (renderMode === LineRenderMode.RANDOM) {
            if (Random.randomBoolean()) {
                this.#RENDER_MODE = LineRenderMode.SEGMENTS;
            } else {
                this.#RENDER_MODE = LineRenderMode.VERTICES;
            }
        } else {
            this.#RENDER_MODE = renderMode;
        }

        const mode: CoordinateMode = CoordinateMode.CANVAS;
        const lineStart: P5Lib.Vector = buildVector(startCoordinate, mode);
        const lineEnd: P5Lib.Vector = buildVector(endCoordinate, mode);

        this.#GRADIENT = gradient;
        this.#minGradientY = minGradientY ?? lineStart.y;
        this.#maxGradientY = maxGradientY ?? lineEnd.y;

        this.#build();
    }

    public override draw(): void {
        if (this.#RENDER_MODE === LineRenderMode.SEGMENTS) {
            for (const segment of this.#SEGMENTS) {
                segment.draw();
            }
        } else {
            const p5 = P5Context.p5;
            const mode: CoordinateMode = CoordinateMode.CANVAS;
            p5.strokeWeight(CanvasContext.defaultStroke * this.strokeWeightMultiplier);
            p5.beginShape();

            for (const vertex of this.#VERTICES) {
                p5.stroke(vertex.color.color);
                p5.vertex(vertex.coordinate.getX(mode), vertex.coordinate.getY(mode));
            }

            if (this.#VERTICES.length % 2 === 1) {
                p5.stroke(this.#VERTICES[this.#VERTICES.length - 1].color.color);
                p5.vertex(this.#VERTICES[this.#VERTICES.length - 1].coordinate.getX(mode), this.#VERTICES[this.#VERTICES.length - 1].coordinate.getY(mode) + 0.001);
            }

            p5.endShape();
        }
    }

    public override canvasRedraw(): void {
        super.canvasRedraw();
        for (const line of this.#SEGMENTS) {
            line.canvasRedraw();
        }

        for (const vertex of this.#VERTICES) {
            vertex.coordinate.remap();
        }
    }

    public updateMaxGradientY(maxGradientY: number): void {
        this.#maxGradientY = maxGradientY;
        this.#build();
    }

    #build(): void {
        this.#SEGMENTS.splice(0);
        this.#VERTICES.splice(0);

        const mode: CoordinateMode = CoordinateMode.CANVAS;
        const p5: P5Lib = P5Context.p5;
        const lineStart: P5Lib.Vector = buildVector(this.start, mode);
        const lineEnd: P5Lib.Vector = buildVector(this.end, mode);
        const segmentStart: P5Lib.Vector = lineStart.copy();
        const x: number = lineStart.x;

        let isComplete: boolean = false;
        let gradientStepIndex: number = 0;

        let startGradientPercentage: number = p5.map(segmentStart.y, this.#minGradientY, this.#maxGradientY, 0, 1);
        this.#VERTICES.push({ coordinate: buildCoordinate(segmentStart, mode), color: this.#GRADIENT.getColor(startGradientPercentage) });

        while (!isComplete) {
            let gradientEndPercentage: number | undefined = this.#GRADIENT.getMapMaxPercentage(gradientStepIndex);

            if (gradientEndPercentage === undefined) {
                break;
            }

            let gradientEndY: number = p5.map(gradientEndPercentage, 0, 1, this.#minGradientY, this.#maxGradientY);

            if (segmentStart.y >= gradientEndY) {
                gradientStepIndex++;
                gradientEndPercentage = this.#GRADIENT.getMapMaxPercentage(gradientStepIndex);

                if (gradientEndPercentage === undefined) {
                    break;
                }

                gradientEndY = p5.map(gradientEndPercentage, 0, 1, this.#minGradientY, this.#maxGradientY);
            }

            if (gradientEndY < lineEnd.y) {
                const end: P5Lib.Vector = p5.createVector(x, gradientEndY);
                this.#VERTICES.push({ coordinate: buildCoordinate(end, mode), color: this.#GRADIENT.getColor(gradientEndPercentage) });

                const segment: Line = new Line(
                    buildCoordinate(segmentStart, mode),
                    buildCoordinate(end, mode),
                    this.strokeWeightMultiplier,
                    this.#GRADIENT.getColor(startGradientPercentage));
                segment.colorB = this.#GRADIENT.getColor(gradientEndPercentage);
                this.#SEGMENTS.push(segment);

                segmentStart.set(end.x, end.y);
                startGradientPercentage = p5.map(segmentStart.y, this.#minGradientY, this.#maxGradientY, 0, 1);
            } else {
                const end: P5Lib.Vector = lineEnd.copy();
                const percentage: number = p5.map(end.y, this.#minGradientY, this.#maxGradientY, 0, 1);
                this.#VERTICES.push({ coordinate: buildCoordinate(end, mode), color: this.#GRADIENT.getColor(percentage) });

                const segment: Line = new Line(
                    buildCoordinate(segmentStart, mode),
                    buildCoordinate(end, mode),
                    this.strokeWeightMultiplier,
                    this.#GRADIENT.getColor(startGradientPercentage));
                segment.colorB = this.#GRADIENT.getColor(percentage);
                this.#SEGMENTS.push(segment);

                segmentStart.set(end.x, end.y);
                startGradientPercentage = p5.map(segmentStart.y, this.#minGradientY, this.#maxGradientY, 0, 1);
                isComplete = true;
            }
        }
    }
}
