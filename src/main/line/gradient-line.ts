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

import {CanvasContext, Color, Coordinate, CoordinateMode, P5Context} from "@batpb/genart";
import { Line } from "./line";
import { Gradient } from "../color";

import P5Lib from "p5";

// TODO - draw type: SEGMENT or SINGLE_LINE

export class GradientLine extends Line {
    // readonly #SLICE_TOTAL: number;
    // readonly #SEGMENTS: Line[] = [];

    readonly #VERTICES: {point: P5Lib.Vector, color: Color}[] = [];

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
        const lineStart: P5Lib.Vector = p5.createVector(startCoordinate.getX(mode), startCoordinate.getY(mode));
        const lineEnd: P5Lib.Vector = p5.createVector(endCoordinate.getX(mode), endCoordinate.getY(mode));
        const segementStart: P5Lib.Vector = lineStart.copy();
        let isComplete: boolean = false;
        let gradientStepIndex: number = 0;

        this.#VERTICES.push({ point: segementStart.copy(), color: gradient.getColor(segementStart.y) });

        while (!isComplete) {
            let gradientEndY: number | undefined = gradient.getMapMax(gradientStepIndex);

            if (gradientEndY === undefined) {
                isComplete = true;
                break;
            }

            if (segementStart.y >= gradientEndY) {
                gradientStepIndex++;
                gradientEndY = gradient.getMapMax(gradientStepIndex);

                if (gradientEndY === undefined) {
                    isComplete = true;
                    break;
                }
            }

            if (gradientEndY < lineEnd.y) {
                const end: P5Lib.Vector = p5.createVector(lineEnd.x, gradientEndY);

                this.#VERTICES.push({ point: end.copy(), color: gradient.getColor(end.y) });
                segementStart.set(end.x, end.y);
            } else {
                const end: P5Lib.Vector = lineEnd.copy();

                this.#VERTICES.push({ point: end.copy(), color: gradient.getColor(end.y) });
                segementStart.set(end.x, end.y);
                isComplete = true;
            }
        }

        // segments built from gradient min and max values
        // for (let i = 1; i < gradient.stepTotal; i++) {
        //     const percentage: number = i / (gradient.stepTotal - 1);
        //     const end: P5Lib.Vector = p5.createVector(endCoordinate.getX(mode), endCoordinate.getY(mode));
        //     const endVector: P5Lib.Vector = P5Lib.Vector.lerp(start, end, percentage);
        //
        //     const colorA: Color = gradient.color(i - 1);
        //     const colorB: Color = gradient.color(i);
        //
        //     const lineStart: Coordinate = new Coordinate();
        //     lineStart.setX(start.x, mode);
        //     lineStart.setY(start.y, mode);
        //
        //     const lineEnd: Coordinate = new Coordinate();
        //     lineEnd.setX(endVector.x, mode);
        //     lineEnd.setY(endVector.y, mode);
        //
        //     const line: Line = new Line(
        //         lineStart,
        //         lineEnd,
        //         colorA,
        //         strokeWeightMultiplier
        //     );
        //
        //     line.colorB = colorB;
        //     this.#SEGMENTS.push(line);
        //
        //     start.set(endVector.x, endVector.y);
        // }

        console.log(this.#VERTICES.length);
    }

    public override draw(): void {
        // plot all segment points in one beginShape()/endShape() call
        // for (const segment of this.#SEGMENTS) {
        //     segment.draw();
        // }
        const p5 = P5Context.p5;
        p5.strokeWeight(CanvasContext.defaultStroke * this.strokeWeightMultiplier);
        p5.beginShape();
        for (const vertex of this.#VERTICES) {
            p5.stroke(vertex.color.color);
            p5.vertex(vertex.point.x, vertex.point.y);
        }

        if (this.#VERTICES.length % 2 === 1) {
            // console.log('extra vertex');
            p5.stroke(this.#VERTICES[this.#VERTICES.length - 1].color.color);
            p5.vertex(this.#VERTICES[this.#VERTICES.length - 1].point.x, this.#VERTICES[this.#VERTICES.length - 1].point.y + 0.001);
        }

        p5.endShape();
    }
}
