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

// TODO - implement LineTransparency categories
export enum LineTransparency {
    SOLID = 'solid',
    LOW_TRANSPARENCY = 'low-transparency',
    MEDIUM_TRANSPARENCY = 'medium-transparency',
    HIGH_TRANSPARENCY = 'high-transparency',
    MIXED = 'mixed'
}

export enum LineGradient {
    SOLID = 'solid',
    WINDOW_GRADIENT = 'window-gradient',
    LINE_LENGTH_GRADIENT = 'line-length-gradient',
    MAX_LENGTH_GRADIENT = 'max-length-gradient'
}

export enum ColorLayout {
    /**
     * All lines have the same color.
     */
    SAME_COLOR = 'same-color',

    /**
     * All lines have the same gradient.
     */
    SAME_GRADIENT = 'same-gradient',

    /**
     * Gradient is built from one side of the window to the other.
     */
    WINDOW_GRADIENT = 'window-gradient'
}

export enum LineTrend {
    CONSTANT = 'constant',
    INCREASE_TO_LEFT = 'increase-to-left',
    INCREASE_TO_RIGHT = 'increase-to-right'
}

export enum LineAlignment {
    TOP = 'top',
    BOTTOM = 'bottom',
    MIDDLE = 'middle',
    PATH = 'path',
    MIXED = 'mixed'
}
