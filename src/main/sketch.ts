/*
 * Copyright (C) 2023-2025 brittni and the polar bear LLC.
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

import '../../assets/styles/sketch.css';

import {
    ALL_PALETTES,
    ASPECT_RATIOS,
    CanvasContext,
    CanvasScreen,
    ColorSelector,
    ColorSelectorManager,
    P5Context,
    Palette,
    PaletteColorSelector,
    Random,
    Range,
    ScreenHandler
} from '@batpb/genart';

import {HexColorSelector} from './color';
import {LineDensity, LineFill, LineLength, LineTrend} from './line-categories';
import {FallingLines, LinesConfig} from './falling-lines';
import {CategorySelector} from './selector';
import {LineRenderMode} from "./line";

interface HexPalette {
    name: string;
    colors: string[];
}

// TODO - selecting a high density makes it more likely to select a smaller thickness.
// TODO - selecting a high density makes it more likely to select a higher transparency.
// TODO - solid lines with gradient are drawn with a VERTICES render mode.

// TODO - get 1 print/product output for each achieved goal

// TODO - COLOR TYPES
// - solid
// - constant vertical window gradient (2 - n colors)
// - constant vertical line gradient (2 - n colors)
// - random vertical window gradient (2 - n colors)
// - random vertical line gradient (2 - n colors)
// - constant vertical window gradient (2 - n colors) changing over a horizontal gradient (2 color sets)
// - constant vertical line gradient (2 - n colors) changing over a horizontal gradient (2 color sets)

// TODO - COLOR SELECTION
// 2 - n color selection in HexColorPalette
// - 30 HexColor palettes
// RGB Color Selector
// HSB Color Selector
  // Gradients built from HSB mapping
// 20 batpb/genart palettes
  // Gradients build from gradient palettes

function sketch(p5: P5Lib): void {
    const LINE_DENSITY_SELECTOR: CategorySelector<LineDensity> = new CategorySelector<LineDensity>([
        // { category: LineDensity.LOW, range: new Range(5, 15) },
        { category: LineDensity.MEDIUM, range: new Range(10, 30) },
        { category: LineDensity.HIGH, range: new Range(25, 200) }
    ], false);

    function buildPalettes(): HexPalette[] {
        return [
            { name: 'winter blues', colors: ['#dfebf1', '#a4c0df', '#7a9ec7', '#3e6589', '#052542'] },
            { name: 'winter calm', colors: ['#badaee', '#8cc2e3', '#61879e', '#b7bee1', '#dedede'] },
            { name: 'dark winter', colors: ['#e3d4ed', '#c9c1cd', '#baaac5', '#8f81a7', '#775a90'] },
            { name: 'mindful palette no. 104', colors: ['#f7f4e9', '#ebdbc1', '#7d8778', '#74583e', '#5e4662', '#131210'] },
            { name: 'winter pine forest', colors: ['#2a314b', '#415676', '#637ea1', '#89aacd', '#b7d9f5'] },
            { name: 'winter sunrise', colors: ['#9994d6', '#9fade0', '#aec4ea', '#b9daee', '#c7ecf0'] },
            { name: 'persephone in winter', colors: ['#1c101e', '#3f0d2a', '#610a34', '#930643', '#e8025e'] },
            { name: 'forest frost', colors: ['#6a907f', '#a2c3b1', '#cee4df', '#ebf4f4', '#f5fff7'] },
            { name: 'winter pine', colors: ['#cad3c5', '#84a98c', '#537970', '#344d50', '#2f3e46'] }
        ];
    }

    p5.setup = (): void => {
        P5Context.initialize(p5);
        CanvasContext.buildCanvas(ASPECT_RATIOS.SQUARE, 720, p5.WEBGL, true);
        const palettes: HexPalette[] = buildPalettes();
        const palette: HexPalette | undefined = Random.randomElement(palettes);
        let selector: ColorSelector;

        if (Random.randomBoolean() && palette) {
            selector = new HexColorSelector(true, palette.colors);
        } else {
            const palettes: Palette[] = Array.from(ALL_PALETTES.values);
            const selectors: ColorSelector[] = palettes.map((palette: Palette) => {return new PaletteColorSelector(palette)});
            const selectorManager: ColorSelectorManager = new ColorSelectorManager();
            selectorManager.addColorSelectors(selectors);
            selector = selectorManager.getRandomColorSelector();
        }

        LINE_DENSITY_SELECTOR.setRandomCategory();

        const lineFill: LineFill = Random.randomElement([LineFill.EVEN_OVERLAP, LineFill.RANDOM_OVERLAP]) ?? LineFill.EVEN_OVERLAP;
        const lineTrend: LineTrend = Random.randomElement(Object.values(LineTrend)) ?? LineTrend.CONSTANT;

        const config: LinesConfig = {
            NAME: 'Falling Lines',
            LINE_TOTAL: Math.floor(LINE_DENSITY_SELECTOR.getChoice()),
            // LINE_TOTAL: 25,
            LINE_FILL_CATEGORY: lineFill,
            // LINE_FILL_CATEGORY: LineFill.RANDOM_OVERLAP,
            LINE_TREND_CATEGORY: lineTrend,
            // LINE_TREND_CATEGORY: LineTrend.CONSTANT,
            COLOR_SELECTOR: selector,
            LINE_LENGTH_CATEGORY: Random.randomElement([LineLength.FULL_SCREEN, LineLength.MEDIUM, LineLength.LONG]) ?? LineLength.FULL_SCREEN,
            // THICKNESS_CATEGORY: LineThickness.MIXED,
            GRADIENT_RENDER: Random.randomElement(Object.values(LineRenderMode)),
            // LINE_TRANSPARENCY_CATEGORY: LineTransparency.HIGH_TRANSPARENCY,
        };

        const fallingLines: CanvasScreen = new FallingLines(config);
        ScreenHandler.addScreen(fallingLines);
        ScreenHandler.currentScreen = fallingLines.NAME;
    };

    p5.draw = (): void => {
        ScreenHandler.draw();
    };

    p5.keyPressed = (): void => {
        ScreenHandler.keyPressed();
    };

    p5.mousePressed = (): void => {
        ScreenHandler.mousePressed();
    };

    p5.windowResized = (): void => {
        CanvasContext.resizeCanvas();
    };
}

new P5Lib(sketch);
