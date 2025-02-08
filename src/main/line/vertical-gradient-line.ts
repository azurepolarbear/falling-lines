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

    readonly #VERTICES: {coordinate: Coordinate, color: Color}[] = [];
    readonly #RENDER_MODE: LineRenderMode;

    // TODO - clean up constructor logic?
    public constructor(startCoordinate: Coordinate,
                       endCoordinate: Coordinate,
                       strokeWeightMultiplier: number,
                       gradient: MappedGradient,
                       renderMode: LineRenderMode,
                       minGradientY?: number,
                       maxGradientY?: number
    ) {
        super(startCoordinate, endCoordinate, strokeWeightMultiplier);
        const p5 = P5Context.p5;

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
        const segmentStart: P5Lib.Vector = lineStart.copy();
        const x: number = lineStart.x;

        if (minGradientY === undefined) {
            minGradientY = lineStart.y;
        }

        if (maxGradientY === undefined) {
            maxGradientY = lineEnd.y;
        }

        let isComplete: boolean = false;
        let gradientStepIndex: number = 0;

        let startGradientPercentage: number = p5.map(segmentStart.y, minGradientY, maxGradientY, 0, 1);
        this.#VERTICES.push({ coordinate: buildCoordinate(segmentStart, mode), color: gradient.getColor(startGradientPercentage) });

        while (!isComplete) {
            let gradientEndPercentage: number | undefined = gradient.getMapMaxPercentage(gradientStepIndex);

            if (gradientEndPercentage === undefined) {
                isComplete = true;
                break;
            }

            let gradientEndY: number = p5.map(gradientEndPercentage, 0, 1, minGradientY, maxGradientY);

            if (segmentStart.y >= gradientEndY) {
                gradientStepIndex++;
                gradientEndPercentage = gradient.getMapMaxPercentage(gradientStepIndex);

                if (gradientEndPercentage === undefined) {
                    isComplete = true;
                    break;
                }

                gradientEndY = p5.map(gradientEndPercentage, 0, 1, minGradientY, maxGradientY);
            }

            if (gradientEndY < lineEnd.y) {
                const end: P5Lib.Vector = p5.createVector(x, gradientEndY);
                this.#VERTICES.push({ coordinate: buildCoordinate(end, mode), color: gradient.getColor(gradientEndPercentage) });

                const segment: Line = new Line(
                    buildCoordinate(segmentStart, mode),
                    buildCoordinate(end, mode),
                    strokeWeightMultiplier,
                    gradient.getColor(startGradientPercentage),);
                segment.colorB = gradient.getColor(gradientEndPercentage);
                this.#SEGMENTS.push(segment);

                segmentStart.set(end.x, end.y);
                startGradientPercentage = p5.map(segmentStart.y, minGradientY, maxGradientY, 0, 1);
            } else {
                const end: P5Lib.Vector = lineEnd.copy();
                const percentage: number = p5.map(end.y, minGradientY, maxGradientY, 0, 1);
                this.#VERTICES.push({ coordinate: buildCoordinate(end, mode), color: gradient.getColor(percentage) });

                const segment: Line = new Line(
                    buildCoordinate(segmentStart, mode),
                    buildCoordinate(end, mode),
                    strokeWeightMultiplier,
                    gradient.getColor(startGradientPercentage));
                segment.colorB = gradient.getColor(percentage);
                this.#SEGMENTS.push(segment);

                segmentStart.set(end.x, end.y);
                startGradientPercentage = p5.map(segmentStart.y, minGradientY, maxGradientY, 0, 1);
                isComplete = true;
            }
        }
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
}
