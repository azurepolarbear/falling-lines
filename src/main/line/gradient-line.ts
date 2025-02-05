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

import { Color, Coordinate, CoordinateMode, P5Context } from "@batpb/genart";
import { Line } from "./line";
import { Gradient } from "../color";

import P5Lib from "p5";

// TODO - draw type: SEGMENT or SINGLE_LINE

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

        // segments built from gradient min and max values
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
        // plot all segment points in one beginShape()/endShape() call
        for (const segment of this.#SEGMENTS) {
            segment.draw();
        }
    }
}
