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

export enum LineDensity {
    LOW = 'low',
    MEDIUM = 'medium',
    HIGH = 'high'
}

export enum LineThickness {
    THIN = 'thin',
    THIN_MEDIUM = 'thin-medium',
    MEDIUM = 'medium',
    MEDIUM_THICK = 'medium-thick',
    THICK = 'thick',
    MIXED = 'mixed'
}

export enum LineFill {
    // TODO - implement FILL category
    /**
     * Lines are built to fill in the canvas without overlapping.
     */
    FILL = 'fill',

    /**
     * Lines are built equidistant from each other and can overlap.
     */
    EVEN_OVERLAP = 'even-overlap',

    /**
     * Lines are built at random distances from each other and can overlap.
     */
    RANDOM_OVERLAP = 'random-overlap',

    // TODO - implement EVEN_NO_OVERLAP category
    /**
     * Lines are built equidistant from each other and do not overlap.
     */
    EVEN_NO_OVERLAP = 'even-no-overlap',

    // TODO - implement RANDOM_NO_OVERLAP category
    /**
     * Lines are built at random distances from each other and do not overlap.
     */
    RANDOM_NO_OVERLAP = 'random-no-overlap',

    // TODO - implement CLUSTERS category
    CLUSTERS = 'clusters'
}

export enum LineLength {
    SHORT = 'short',
    MEDIUM = 'medium',
    LONG = 'long',
    FULL_SCREEN = 'full-screen',
    FULL_SCREEN_ONLY = 'full-screen-only',
    MIXED = 'mixed'
}

export enum LineTrend {
    CONSTANT = 'constant',
    INCREASE_TO_LEFT = 'increase-to-left',
    INCREASE_TO_RIGHT = 'increase-to-right'
}

export enum LineTransparency {
    SOLID = 'solid',
    LOW_TRANSPARENCY = 'low-transparency',
    MEDIUM_TRANSPARENCY = 'medium-transparency',
    HIGH_TRANSPARENCY = 'high-transparency',
    MIXED = 'mixed'
}

export enum LineGradient {
    SOLID = 'solid',
    CONSTANT_WINDOW_GRADIENT = 'constant-window-gradient',
    CONSTANT_LINE_LENGTH_GRADIENT = 'constant-line-length-gradient',
    CONSTANT_MAX_LENGTH_GRADIENT = 'constant-max-length-gradient',
    RANDOM_LINE_LENGTH_GRADIENT = 'random-line-length-gradient',
    RANDOM_WINDOW_GRADIENT = 'random-window-gradient',
}

export enum LineAlignment {
    TOP = 'top',
    BOTTOM = 'bottom',
    MIDDLE = 'middle',
    PATH = 'path',
    MIXED = 'mixed'
}

export function isLineLengthTypeGradient(lineGradient: LineGradient): boolean {
    const constant: boolean = lineGradient === LineGradient.CONSTANT_LINE_LENGTH_GRADIENT;
    const random: boolean = lineGradient === LineGradient.RANDOM_LINE_LENGTH_GRADIENT;
    return constant || random;
}

export function isConstantTypeGradient(lineGradient: LineGradient): boolean {
    const window: boolean = lineGradient === LineGradient.CONSTANT_WINDOW_GRADIENT;
    const line: boolean = lineGradient === LineGradient.CONSTANT_LINE_LENGTH_GRADIENT;
    const max: boolean = lineGradient === LineGradient.CONSTANT_MAX_LENGTH_GRADIENT;
    return window || line || max;
}
