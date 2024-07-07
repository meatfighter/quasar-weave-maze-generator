import { defineStore } from 'pinia';
import { computed, nextTick, ref, watch } from 'vue';
import { clamp } from 'src/utils/numbers';
import {
    onBackgroundColor, onCellAndImageSize,
    onCrossPct, onLineWidthPct,
    onLongPassages,
    onLoopPct, onMask,
    onMazeHeight,
    onMazeWidth, onPassageWidthPct, onSolution, onSolutionColor, onSquareCorners, onWallColor
} from 'src/app/controller/maze-controller';
import {
    DEFAULT_BACKGROUND_COLOR,
    DEFAULT_CELL_SIZE,
    DEFAULT_CROSS_PCT,
    DEFAULT_IMAGE_SIZE,
    DEFAULT_LINE_WIDTH_PCT,
    DEFAULT_LONG_PASSAGES,
    DEFAULT_LOOP_PCT,
    DEFAULT_MAZE_SIZE,
    DEFAULT_PASSAGE_WIDTH_PCT, DEFAULT_SOLUTION, DEFAULT_SOLUTION_COLOR, DEFAULT_SQUARE_CORNERS,
    DEFAULT_WALL_COLOR,
    MAX_CROSS_PCT,
    MAX_IMAGE_SIZE,
    MAX_LINE_WIDTH_PCT,
    MAX_LOOP_PCT,
    MAX_MAZE_SIZE,
    MAX_PASSAGE_WIDTH_PCT,
    MIN_CELL_SIZE,
    MIN_CROSS_PCT,
    MIN_IMAGE_SIZE,
    MIN_LINE_WIDTH_PCT,
    MIN_LOOP_PCT,
    MIN_MAZE_SIZE,
    MIN_PASSAGE_WIDTH_PCT
} from 'src/app/controller/defaults';
import { Rgbas } from 'src/app/color/Rgbas';
import { toBlobUrl } from 'src/utils/blob';

export const useOptionsStore = defineStore('options', () => {
    const mazeWidth = ref(DEFAULT_MAZE_SIZE);
    watch(mazeWidth, (value, oldValue) => {
        const newValue = clamp(value, MIN_MAZE_SIZE, MAX_MAZE_SIZE, DEFAULT_MAZE_SIZE, true);
        if (newValue !== value) {
            mazeWidth.value = newValue;
        }
        if (newValue !== oldValue) {
            updateCellAndImageSize(cellSize.value, cellSize.value * newValue, cellSize.value * mazeHeight.value);
            onMazeWidth(newValue);
        }
    });

    const mazeHeight = ref(DEFAULT_MAZE_SIZE);
    watch(mazeHeight, (value, oldValue) => {
        const newValue = clamp(value, MIN_MAZE_SIZE, MAX_MAZE_SIZE, DEFAULT_MAZE_SIZE, true);
        if (newValue !== value) {
            mazeHeight.value = newValue;
        }
        if (newValue !== oldValue) {
            updateCellAndImageSize(cellSize.value, cellSize.value * mazeWidth.value, cellSize.value * newValue);
            onMazeHeight(newValue);
        }
    });

    const loopPct = ref(DEFAULT_LOOP_PCT);
    watch(loopPct, (value, oldValue) => {
        const newValue = clamp(value, MIN_LOOP_PCT, MAX_LOOP_PCT, DEFAULT_LOOP_PCT);
        if (newValue !== value) {
            loopPct.value = newValue;
        }
        if (newValue !== oldValue) {
            onLoopPct(newValue);
        }
    });

    const crossPct = ref(DEFAULT_CROSS_PCT);
    watch(crossPct, (value, oldValue) => {
        const newValue = clamp(value, MIN_CROSS_PCT, MAX_CROSS_PCT, DEFAULT_CROSS_PCT);
        if (newValue !== value) {
            crossPct.value = newValue;
        }
        if (newValue !== oldValue) {
            onCrossPct(newValue);
        }
    });

    const longPassages = ref(DEFAULT_LONG_PASSAGES);
    watch(longPassages, (value, oldValue) => {
        if (value !== oldValue) {
            onLongPassages(longPassages.value);
        }
    });

    function updateCellAndImageSize(cSize: number, imgWidth: number, imgHeight: number) {

        let changes: boolean
        do {
            changes = false;
            if (cSize < MIN_CELL_SIZE) {
                cSize = MIN_CELL_SIZE;
                imgWidth = cSize * mazeWidth.value;
                imgHeight = cSize * mazeHeight.value;
                changes = true;
            } else if (imgWidth < MIN_IMAGE_SIZE) {
                imgWidth = MIN_IMAGE_SIZE;
                cSize = imgWidth / mazeWidth.value;
                imgHeight = imgWidth * mazeHeight.value / mazeWidth.value;
                changes = true;
            } else if (imgWidth > MAX_IMAGE_SIZE) {
                imgWidth = MAX_IMAGE_SIZE;
                cSize = imgWidth / mazeWidth.value;
                imgHeight = imgWidth * mazeHeight.value / mazeWidth.value;
                changes = true;
            } else if (imgHeight < MIN_IMAGE_SIZE) {
                imgHeight = MIN_IMAGE_SIZE;
                cSize = imgHeight / mazeHeight.value;
                imgWidth = imgHeight * mazeWidth.value / mazeHeight.value;
                changes = true;
            } else if (imgHeight > MAX_IMAGE_SIZE) {
                imgHeight = MAX_IMAGE_SIZE;
                cSize = imgHeight / mazeHeight.value;
                imgWidth = imgHeight * mazeWidth.value / mazeHeight.value;
                changes = true;
            }
        } while (changes);

        if (cSize !== cellSize.value) {
            cellSize.value = cSize;
        }
        if (imgWidth !== imageWidth.value) {
            imageWidth.value = imgWidth;
        }
        if (imgHeight !== imageHeight.value) {
            imageHeight.value = imgHeight;
        }

        onCellAndImageSize(cSize, imgWidth, imgHeight);
    }

    const cellSize = ref(DEFAULT_CELL_SIZE);
    watch(cellSize, value => {
        const cSize = Math.max(MIN_CELL_SIZE, value);
        const imgWidth = cSize * mazeWidth.value;
        const imgHeight = cSize * mazeHeight.value;
        updateCellAndImageSize(cSize, imgWidth, imgHeight);
    });

    const imageWidth = ref(DEFAULT_IMAGE_SIZE);
    watch(imageWidth, value => {
        const imgWidth = clamp(value, MIN_IMAGE_SIZE, MAX_IMAGE_SIZE, DEFAULT_IMAGE_SIZE);
        const imgHeight = imgWidth * mazeHeight.value / mazeWidth.value;
        const cSize = imgWidth / mazeWidth.value;
        updateCellAndImageSize(cSize, imgWidth, imgHeight);
    });

    const imageHeight = ref(DEFAULT_IMAGE_SIZE);
    watch(imageHeight, value => {
        const imgHeight = clamp(value, MIN_IMAGE_SIZE, MAX_IMAGE_SIZE, DEFAULT_IMAGE_SIZE);
        const imgWidth = imgHeight * mazeWidth.value / mazeHeight.value;
        const cSize = imgHeight / mazeHeight.value;
        updateCellAndImageSize(cSize, imgWidth, imgHeight);
    });

    const squareCorners = ref(DEFAULT_LONG_PASSAGES);
    watch(squareCorners, (value, oldValue) => {
        if (value !== oldValue) {
            onSquareCorners(value);
        }
    });

    const lineWidthPct = ref(DEFAULT_LINE_WIDTH_PCT);
    watch(lineWidthPct, (value, oldValue) => {
        const newValue = clamp(value, MIN_LINE_WIDTH_PCT, MAX_LINE_WIDTH_PCT, DEFAULT_LINE_WIDTH_PCT);
        if (newValue !== value) {
            lineWidthPct.value = newValue;
        }
        if (newValue !== oldValue) {
            onLineWidthPct(newValue);
        }
    });

    const passageWidthPct = ref(DEFAULT_PASSAGE_WIDTH_PCT);
    watch(passageWidthPct, (value, oldValue) => {
        const newValue = clamp(value, MIN_PASSAGE_WIDTH_PCT, MAX_PASSAGE_WIDTH_PCT, DEFAULT_PASSAGE_WIDTH_PCT);
        if (newValue !== value) {
            passageWidthPct.value = newValue;
        }
        if (newValue !== oldValue) {
            onPassageWidthPct(newValue);
        }
    });

    const wallColor = ref(DEFAULT_WALL_COLOR);
    watch(wallColor, (value, oldValue) => {
        if (value !== oldValue) {
            onWallColor(value);
        }
    });

    const backgroundColor = ref(DEFAULT_BACKGROUND_COLOR);
    watch(backgroundColor, (value, oldValue) => {
        if (value !== oldValue) {
            onBackgroundColor(value);
        }
    });

    const solutionColor = ref(DEFAULT_SOLUTION_COLOR);
    watch(solutionColor, (value, oldValue) => {
        if (value !== oldValue) {
            onSolutionColor(value);
        }
    });

    const solution = ref(DEFAULT_SOLUTION);
    watch(solution, (value, oldValue) => {
        if (value !== oldValue) {
            onSolution(value);
        }
    });

    const maskRgbas = ref<Rgbas | null>(null);
    watch(maskRgbas, (value, oldValue) => {
        if (value !== oldValue) {
            if (value) {
                mazeWidth.value = value.width;
                mazeHeight.value = value.height;
            } else {
                mazeWidth.value = DEFAULT_MAZE_SIZE;
                mazeHeight.value = DEFAULT_MAZE_SIZE;
            }
            void nextTick(() => onMask(value ? toBlobUrl(value.data) : undefined));
        }
    });

    const resettable = computed(() =>
        mazeWidth.value !== DEFAULT_MAZE_SIZE
            || mazeHeight.value !== DEFAULT_MAZE_SIZE
            || loopPct.value !== DEFAULT_LOOP_PCT
            || crossPct.value !== DEFAULT_CROSS_PCT
            || longPassages.value !== DEFAULT_LONG_PASSAGES
            || cellSize.value !== DEFAULT_CELL_SIZE
            || imageWidth.value !== DEFAULT_IMAGE_SIZE
            || imageHeight.value !== DEFAULT_IMAGE_SIZE
            || squareCorners.value !== DEFAULT_SQUARE_CORNERS
            || lineWidthPct.value !== DEFAULT_LINE_WIDTH_PCT
            || passageWidthPct.value !== DEFAULT_PASSAGE_WIDTH_PCT
            || wallColor.value !== DEFAULT_WALL_COLOR
            || backgroundColor.value !== DEFAULT_BACKGROUND_COLOR
            || solutionColor.value !== DEFAULT_SOLUTION_COLOR
            || solution.value !== DEFAULT_SOLUTION
    );

    function reset() {
        mazeWidth.value = DEFAULT_MAZE_SIZE;
        mazeHeight.value = DEFAULT_MAZE_SIZE;
        loopPct.value = DEFAULT_LOOP_PCT;
        crossPct.value = DEFAULT_CROSS_PCT;
        longPassages.value = DEFAULT_LONG_PASSAGES;
        cellSize.value = DEFAULT_CELL_SIZE;
        imageWidth.value = DEFAULT_IMAGE_SIZE;
        imageHeight.value = DEFAULT_IMAGE_SIZE;
        squareCorners.value = DEFAULT_SQUARE_CORNERS;
        lineWidthPct.value = DEFAULT_LINE_WIDTH_PCT;
        passageWidthPct.value = DEFAULT_PASSAGE_WIDTH_PCT;
        wallColor.value = DEFAULT_WALL_COLOR;
        backgroundColor.value = DEFAULT_BACKGROUND_COLOR;
        solutionColor.value = DEFAULT_SOLUTION_COLOR;
        solution.value = DEFAULT_SOLUTION;
    }

    return { mazeWidth, mazeHeight, loopPct, crossPct, longPassages, cellSize, imageWidth, imageHeight, squareCorners,
            lineWidthPct, passageWidthPct, wallColor, backgroundColor, solutionColor, solution, resettable, maskRgbas,
            reset };
});