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
import { Coordinate, CoordinateMode, P5Context } from '@batpb/genart';

// TODO - implement functionality in @batpb/genart library

function buildCoordinate(x: number, y: number, mode: CoordinateMode): Coordinate;
function buildCoordinate(vector: P5Lib.Vector, mode: CoordinateMode): Coordinate;
function buildCoordinate(arg1: P5Lib.Vector | number, arg2: CoordinateMode | number, arg3?: CoordinateMode): Coordinate {
    const coordinate: Coordinate = new Coordinate();

    if (arg1 instanceof P5Lib.Vector && typeof arg2 !== 'number') {
        const vector: P5Lib.Vector = arg1;
        const mode: CoordinateMode = arg2;
        coordinate.setX(vector.x, mode);
        coordinate.setY(vector.y, mode);
    } else if (typeof arg1 === 'number' && typeof arg2 === 'number' && arg3) {
        const x: number = arg1;
        const y: number = arg2;
        const mode: CoordinateMode = arg3;
        coordinate.setX(x, mode);
        coordinate.setY(y, mode);
    }

    return coordinate;
}

function buildVector(coordinate: Coordinate, mode: CoordinateMode): P5Lib.Vector {
    return P5Context.p5.createVector(coordinate.getX(mode), coordinate.getY(mode));
}

function copyCoordinate(coordinate: Coordinate): Coordinate {
    const mode: CoordinateMode = CoordinateMode.CANVAS;
    return buildCoordinate(coordinate.getX(mode), coordinate.getY(mode), mode);
}

export { buildCoordinate, buildVector, copyCoordinate };
