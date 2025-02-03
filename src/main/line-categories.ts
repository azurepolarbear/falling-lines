export enum LineDensity {
    LOW = 'low',
    MEDIUM = 'medium',
    HIGH = 'high'
}

export enum LineThickness {
    THIN = 'thin',
    MEDIUM = 'medium',
    THICK = 'thick'
}

export enum LineFill {
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

    /**
     * Lines are built equidistant from each other and do not overlap.
     */
    EVEN_NO_OVERLAP = 'even-no-overlap',

    /**
     * Lines are built at random distances from each other and do not overlap.
     */
    RANDOM_NO_OVERLAP = 'random-no-overlap'
}
