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

import { HexColorSelector } from './color';
import { FallingLines, LinesConfig } from './falling-lines';
import { LineDensity, LineFill, LineTrend } from './line-categories';
import { CategorySelector } from './selector';

interface HexPalette {
    name: string;
    colors: string[];
}

// Possible new name: parallel lines

// TODO - selecting a high density makes it more likely to select a smaller thickness.
// TODO - selecting a high density makes it more likely to select a higher transparency.
// TODO - solid lines with gradient are drawn with a VERTICES render mode.

// TODO - COLOR SELECTION
// 2 - n color selection in HexColorPalette
// - 30 HexColor palettes
// RGB Color Selector
// HSB Color Selector
//   Gradients built from HSB mapping
// 20 batpb/genart palettes
//   Gradients build from gradient palettes

// TODO
// TODO - color palettes
// TODO - gradient palettes
// TODO - RGB color selector
// TODO - HSB color selector
// TODO - HSB mapping
// TODO - rename to parallel lines
// TODO - implement different line starting points
// TODO - add horizontal lines
// TODO - add diagonal lines
// TODO - add line sets

function sketch(p5: P5Lib): void {
    const LINE_DENSITY_SELECTOR: CategorySelector<LineDensity> = new CategorySelector<LineDensity>([
        { category: LineDensity.LOW, range: new Range(5, 15) },
        { category: LineDensity.LOW_MEDIUM, range: new Range(10, 20) },
        { category: LineDensity.MEDIUM, range: new Range(10, 30) },
        { category: LineDensity.MEDIUM_HIGH, range: new Range(20, 50) },
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
            { name: 'winter pine', colors: ['#cad3c5', '#84a98c', '#537970', '#344d50', '#2f3e46'] },
            { name: 'cherry, orange, lemon, lime', colors: ['#ff5c5c', '#ffa852', '#ffce5c', '#b8e77e', '#63c57f'] },
            { name: 'costa rican daze', colors: ['#000000', '#444444', '#FFFBFC', '#AC206A', '#3C91E6'] },
            { name: 'garden shadow', colors: ['#000000', '#444444', '#71B340', '#AC206A', '#3C91E6'] },
            { name: 'sunset shadow', colors: ['#000000', '#444444', '#D17A22', '#AC206A', '#3C91E6'] },
            { name: 'bring on the neon', colors: ['#ff00a9', '#8000ff', '#f0ff07', '#a5ff0b', '#00ddff'] },
            { name: 'beach belladonna', colors: ['#94dfca', '#435f54', '#120a0a', '#230717', '#260606'] },
            { name: 'ninja ocean', colors: ['#785995', '#4f2597', '#352672', '#1c2d4a', '#073224', '#122a1b'] },
            { name: 'femme concrete', colors: ['#cecfcb', '#babfb8', '#93828f', '#6a4165', '#44063c', '#39052b'] },
            { name: 'california wine sunset', colors: ['#ffa951', '#ff6f4b', '#e13661', '#a11477', '#1e1a75'] },
            { name: 'pastel rainbow', colors: ['#FFADAD', '#FFD6A5', '#FDFFB6', '#CAFFBF', '#9BF6FF', '#A0C4FF', '#BDB2FF', '#FFC6FF', '#FFFFFC'] },
            { name: 'purple and teal', colors: ['#7400B8', '#6930C3', '#5E60CE', '#5390D9', '#4EA8DE', '#48BFE3', '#56CFE1', '#64DFDF', '#72EFDD', '#80FFDB'] },
            { name: 'butterfly palette, no.1', colors: ['#d5e2ea', '#fcc936', '#12b8a9', '#12828b', '#923367', '#66215a'] },
            { name: 'mindful palette, no. 116', colors: ['#f6f4ef', '#5d1f1e', '#ffe500', '#006ca9', '#301885', '#110044'] },
            { name: 'mindful palette, no. 6', colors: ['#f5f1ea', '#f9a3aa', '#f5576c', '#004953', '#0f282f', '#070d0d'] },
            { name: 'butterfly palette, no. 3', colors: ['#f9fcf3', '#a47299', '#672f58', '#a77c5d', '#7e473f', '#26243e'] },
            { name: 'lava', colors: ['#03071E', '#370617', '#6A040F', '#9D0208', '#D00000', '#DC2F02', '#E85D04', '#F48C06', '#FAA307', '#FFBA08'] },
            { name: 'iceberg', colors: ['#03045E', '#023E8A', '#0077B6', '#0096C7', '#00B4D8', '#48CAE4', '#90E0EF', '#ADE8F4', '#CAF0F8'] },
            { name: "it's a baby", colors: ['#CDB4DB', '#FFC8DD', '#FFAFCC', '#BDE0FE', '#A2D2FF'] },
            { name: 'cobblestone midnight', colors: ['#121212', '#393D3F', '#D3D4D6', '#928E80', '#857C7B', '#334956', '#223843', '#19414D', '#28253A'] },
            { name: 'mardi gras - let the good times roll', colors: ['#cfae29', '#32843b', '#241b20', '#4e2475', '#ffb22b'] },
            { name: 'transgender flag', colors: ['#5BCEFA', '#F5A9B8', '#FFFFFF'] },
            { name: 'bisexual flag', colors: ['#D60270', '#9B4F96', '#0038A8'] },
            { name: 'pride', colors: ['#E40303', '#FF8C00', '#FFED00', '#008026', '#004CFF', '#732982'] },
            { name: 'lavender licorice', colors: ['#000000', '#502F4C', '#70587C', '#C8B8DB', '#F9F4F5'] },
            { name: 'nursery shadow', colors: ['#000000', '#7F95D1', '#FF82A9', '#FFC0BE', '#FFEBE7'] },
            { name: 'sunny ocean sky', colors: ['#003494', '#FFD000', '#D9F0FF', '#A3D5FF', '#83C9F4'] },
            { name: 'nonbinary flag', colors: ['#FCF434', '#FFFFFF', '#9C59D1', '#2C2C2C'] },
            { name: 'miss mayhem too', colors: ['#000000', '#ef6fb5', '#f9f9ea', '#cbacee', '#aaf1ed'] },
            { name: 'mindful palette, no. 151', colors: ['#f9f6f4', '#e8eaea', '#648d95', '#92555b', '#5b4148', '#e6be9c'] }
        ];
    }

    function buildJulyPalettes(): HexPalette[] {
        return [
            { name: 'independence day', colors: ['#E63946', '#F1FAEE', '#A8DADC', '#457B9D', '#1D3557'] },
            { name: 'option-1', colors: ['#BB1212', '#DD7F7F', '#EEEEEE', '#537DA3', '#0E5493'] },
            { name: 'option-2', colors: ['#FF0000', '#FF8484', '#FFFFFF', '#81FCFF', '#00D2FF'] },
            { name: 'option-3', colors: ['#FF0000', '#FFFFFF', '#0900FF'] },
            { name: 'option-4', colors: ['#FF0000', '#FFFFFF', '#4B7BFF'] },
            { name: 'option-5', colors: ['#511F1F', '#5E2F2F', '#DDDCDC', '#36426D', '#2E225C'] },
            { name: 'option-6', colors: ['#FFFFFF', '#FFD8D8', '#FFA6A6', '#B7CEFF', '#D0F2FF'] },
            { name: 'american flag', colors: ['#B31942', '#0A3161'] }
        ];
    }

    function buildGrapevinePalettes(): HexPalette[] {
        return [
            { name: 'grapevine', colors: ['#65204E', '#3C2939', '#4E3B4A', '#37202f', '#FBC253', '#312942', '#FEF9F3'] }
        ];
    }

    function buildMothersDayPalettes(): HexPalette[] {
        return [
            { name: 'mindful palettes, no. 172', colors: ['#FDFAF1', '#FADFD2', '#C6DECF', '#DEBEEF', '#59529C', '#02273A'] },
            { name: 'butterfly palette, no. 20', colors: ['#403A60', '#F5DADF', '#E782A9', '#C04C36', '#73381D', '#3F2021'] },
            { name: 'mindful palettes, no. 129', colors: ['#FDFAF1', '#F5E5CE', '#DDBBFF', '#E5C1A3', '#275779', '#4D213D'] },
            { name: 'mindful palettes, no. 68', colors: ['#FAEADD', '#F29CB7', '#FBCF4F', '#DDAAFF', '#522A6F', '#222023'] },
            { name: 'mindful palettes, no. 103', colors: ['#F9F8EF', '#E5DCD6', '#E4898A', '#A65570', '#94B8C1', '#1A161D'] },
            { name: 'gradient haiku, no. 37', colors: ['#F3FCE1', '#BDF7EF', '#B9DCF2', '#D6C8EE', '#F8C6DB'] },
            { name: 'sorbet', colors: ['#FFC1CF', '#E8FFB7', '#E2A0FF', '#C4F5FC', '#B7FFD8'] },
            { name: 'lilac violet', colors: ['#531CB3', '#944BBB', '#AA7BC3', '#CC92C2'] }
        ];
    }

    function buildPridePalettes(): HexPalette[] {
        return [
            { name: 'pride', colors: ['#E40303', '#FF8C00', '#FFED00', '#008026', '#004CFF', '#732982'] },
            { name: 'progress pride', colors: ['#E40303', '#FF8C00', '#FFED00', '#008026', '#004DFF', '#750787', '#FFFFFF', '#FFAFC8', '#74D7EE', '#613915', '#000000'] },
            { name: 'gay pride flag', colors: ['#078D70', '#26CEAA', '#98E8C1', '#FFFFFF', '#7BADE2', '#5049CC', '#3D1A78'] },
            { name: 'lesbian pride flag', colors: ['#D52D00', '#EF7627', '#FF9A56', '#FFFFFF', '#D162A4', '#B55690', '#A30262'] },
            { name: 'bisexual pride flag', colors: ['#D60270', '#9B4F96', '#0038A8'] },
            { name: 'transgender pride flag', colors: ['#5BCEFA', '#F5A9B8', '#FFFFFF'] },
            { name: 'nonbinary pride flag', colors: ['#FCF434', '#FFFFFF', '#9C59D1', '#2C2C2C'] }
        ];
    }

    function buildHalloweenPalettes(): HexPalette[] {
        return [
            { name: 'mindful palette, no. 86', colors: ['#F5E9CE', '#432E6F', '#FFA102', '#DD5533', '#BC2D29', '#450E15'] },
            { name: 'pastel halloween', colors: ['#FEB1CD', '#000000', '#886EF6', '#BDEF80', '#205E2D'] },
            { name: 'purple pumpkin', colors: ['#2E073F', '#7A1CAC', '#AD49E1', '#EBD3F8'] },
            { name: 'goth dress', colors: ['#EAEAEA', '#893168', '#4A1942', '#2E1C2B', '#050404'] },
            { name: 'the shades of halloween', colors: ['#FF7100', '#FD9702', '#E102FF', '#AE03FF', '#000000'] },
            { name: 'halloween color', colors: ['#2BD011', '#8929BF', '#FD7708', '#FDE500', '#000000'] },
            { name: 'halloween colors 234', colors: ['#000000', '#ff6c00', '#9700f8', '#1dff00', '#000000'] },
            { name: 'halloween scare', colors: ['#000000', '#D04000', '#EB7800', '#7200A5', '#1C9A00'] },
            { name: 'halloween presentation', colors: ['#FF7518', '#855294', '#721F92', '#3D0d52', '#1D002D'] },
            { name: 'toxic halloween candy', colors: ['#3C3C3C', '#A5FFA7', '#FFBB75', '#E0B6FF', '#FF8BBE'] },
            { name: 'halloween punk', colors: ['#EA7C4C', '#94F66D', '#56D465', '#845DC1', '#6834AB'] },
            { name: 'ugly halloween', colors: ['#B65919', '#000000', '#286849', '#570E3B', '#67503A'] },
            { name: 'classic halloween', colors: ['#562c74', '#b45b00', '#000000', '#dddddd', '#234b1a'] },
            { name: 'plastic halloween', colors: ['#483D6D', '#9965BD', '#CAEC6C', '#69AE4E', '#F08831'] },
            { name: 'halloween muse', colors: ['#010101', '#1D002D', '#3D0D52', '#721F92', '#DD69D9'] },
            { name: 'witchy halloween', colors: ['#1F1D4B', '#382F50', '#5E2B66', '#A17539', '#978A60'] },
            { name: 'deathkiss', colors: ['#000000', '#444444', '#5F5F5F', '#797979', '#AC206A'] },
            { name: 'goth babe', colors: ['#4B5D67', '#1A2626', '#170114', '#331134', '#464057'] }
        ];
    }

    p5.setup = (): void => {
        P5Context.initialize(p5);
        p5.pixelDensity(4);
        CanvasContext.buildCanvas(ASPECT_RATIOS.SQUARE, 1080, p5.WEBGL, true);
        const hexPalettes: HexPalette[] = buildPalettes();
        const hexPalette: HexPalette | undefined = Random.randomElement(hexPalettes);
        let selector: ColorSelector;
        // let paletteName: string = '';

        if (Random.randomBoolean() && hexPalette) {
            selector = new HexColorSelector(true, hexPalette.colors);
            console.log(selector);
            // paletteName = hexPalette.name;
        } else {
            const palettes: Palette[] = Array.from(ALL_PALETTES.values);
            const selectors: ColorSelector[] = palettes.map((palette: Palette) => {
                return new PaletteColorSelector(palette);
            });
            const selectorManager: ColorSelectorManager = new ColorSelectorManager();
            selectorManager.addColorSelectors(selectors);
            selector = selectorManager.getRandomColorSelector();
            console.log(selector);
            // paletteName = selector.name;
        }

        const gPalette: HexPalette | undefined = Random.randomElement(buildGrapevinePalettes());
        console.log(gPalette);
        // selector = new HexColorSelector(true, gPalette?.colors ?? ['#000000', '#FFFFFF']);

        const julyPalette: HexPalette | undefined = Random.randomElement(buildJulyPalettes());
        console.log(julyPalette);
        // selector = new HexColorSelector(true, julyPalette?.colors ?? ['#000000', '#FFFFFF']);

        // const index: number = 39;
        // selector = new HexColorSelector(true, hexPalettes[index].colors);
        // paletteName = hexPalettes[index].name;

        const mothersDayPalette: HexPalette | undefined = Random.randomElement(buildMothersDayPalettes());
        console.log(mothersDayPalette);
        // selector = new HexColorSelector(true, mothersDayPalette?.colors ?? ['#000000', '#FFFFFF']);

        const pridePalette: HexPalette | undefined = Random.randomElement(buildPridePalettes());
        console.log(pridePalette);
        // selector = new HexColorSelector(true, pridePalette?.colors ?? ['#000000', '#FFFFFF']);

        const halloweenPalette: HexPalette | undefined = Random.randomElement(buildHalloweenPalettes());
        console.log(halloweenPalette);
        selector = new HexColorSelector(true, halloweenPalette?.colors ?? ['#000000', '#FFFFFF']);

        // console.log(paletteName);
        LINE_DENSITY_SELECTOR.setRandomCategory();

        const lineFill: LineFill = Random.randomElement([LineFill.EVEN_OVERLAP, LineFill.RANDOM_OVERLAP]) ?? LineFill.EVEN_OVERLAP;
        const lineTrend: LineTrend = Random.randomElement(Object.values(LineTrend)) ?? LineTrend.CONSTANT;
        console.log(lineTrend);

        // July 4th config start
        // LINE_DENSITY_SELECTOR.currentCategory = LineDensity.LOW_MEDIUM;

        const config: LinesConfig = {
            NAME: 'Falling Lines',
            LINE_TOTAL: Math.floor(LINE_DENSITY_SELECTOR.getChoice()),
            // LINE_TOTAL: 25,
            LINE_FILL_CATEGORY: lineFill,
            // LINE_FILL_CATEGORY: LineFill.RANDOM_OVERLAP,
            LINE_TREND_CATEGORY: lineTrend,
            // LINE_TREND_CATEGORY: LineTrend.CONSTANT,
            COLOR_SELECTOR: selector
            // LINE_LENGTH_CATEGORY: Random.randomElement([LineLength.FULL_SCREEN, LineLength.MEDIUM_LONG, LineLength.LONG, LineLength.FULL_SCREEN_ONLY, LineLength.MIXED]) ?? LineLength.FULL_SCREEN,
            // LINE_LENGTH_CATEGORY: LineLength.LONG,
            // THICKNESS_CATEGORY: LineThickness.MIXED,
            // THICKNESS_CATEGORY: Random.randomElement([LineThickness.MEDIUM, LineThickness.MEDIUM_THICK, LineThickness.THICK]) ?? LineThickness.THICK,
            // GRADIENT_RENDER: Random.randomElement(Object.values(LineRenderMode)),
            // GRADIENT_RENDER: LineRenderMode.VERTICES,
            // LINE_TRANSPARENCY_CATEGORY: Random.randomElement([LineTransparency.SOLID, LineTransparency.LOW_TRANSPARENCY]) ?? LineTransparency.SOLID
            // GRADIENT_TYPE: LineGradient.RANDOM_WINDOW_GRADIENT,
            // EVEN_GRADIENT: true
            // GRADIENT_TYPE: LineGradient.SOLID,
            // LINE_TRANSPARENCY_CATEGORY: LineTransparency.LOW_TRANSPARENCY
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
