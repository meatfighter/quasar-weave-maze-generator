import { defineStore } from 'pinia';
import { ref, watch } from 'vue';
import { clamp } from 'src/utils/numbers';

export const DEFAULT_MAZE_SIZE = 30;
export const MIN_MAZE_SIZE = 1;
export const MAX_MAZE_SIZE = 200;
export const MAZE_SIZE_STEP = 1;

export const DEFAULT_LOOP_PCT = 5;
export const MIN_LOOP_PCT = 0;
export const MAX_LOOP_PCT = 100;
export const LOOP_PCT_STEP = 1;

export const DEFAULT_CROSS_PCT = 25;
export const MIN_CROSS_PCT = 0;
export const MAX_CROSS_PCT = 100;
export const CROSS_PCT_STEP = 1;

export const DEFAULT_LONG_PASSAGES = false;

export const DEFAULT_CELL_SIZE = 25;
export const MIN_CELL_SIZE = 1;
export const CELL_SIZE_STEP = 1;

export const DEFAULT_IMAGE_SIZE = DEFAULT_MAZE_SIZE * DEFAULT_CELL_SIZE;
export const MIN_IMAGE_SIZE = 1;
export const MAX_IMAGE_SIZE = 10_000;
export const IMAGE_SIZE_STEP = 1;

export const useOptionsStore = defineStore('options', () => {
    const mazeWidth = ref(DEFAULT_MAZE_SIZE);
    watch(mazeWidth, (value, oldValue) => {
        const newValue = clamp(value, MIN_MAZE_SIZE, MAX_MAZE_SIZE, DEFAULT_MAZE_SIZE, true);
        if (newValue !== value) {
            mazeWidth.value = newValue;
        }
        if (newValue !== oldValue) {
            updateCellAndImageSize(cellSize.value, cellSize.value * newValue, cellSize.value * mazeHeight.value);
            //onMazeWidth(newValue);
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
            //onMazeHeight(newValue);
        }
    });

    const loopPct = ref(DEFAULT_CROSS_PCT);
    watch(loopPct, (value, oldValue) => {
        const newValue = clamp(value, MIN_LOOP_PCT, MAX_LOOP_PCT, DEFAULT_LOOP_PCT);
        if (newValue !== value) {
            loopPct.value = newValue;
        }
        if (newValue !== oldValue) {
            //onCrossPct(newValue);
        }
    });

    const crossPct = ref(DEFAULT_CROSS_PCT);
    watch(crossPct, (value, oldValue) => {
        const newValue = clamp(value, MIN_CROSS_PCT, MAX_CROSS_PCT, DEFAULT_CROSS_PCT);
        if (newValue !== value) {
            crossPct.value = newValue;
        }
        if (newValue !== oldValue) {
            //onCrossPct(newValue);
        }
    });

    const longPassages = ref(DEFAULT_LONG_PASSAGES);
    watch(longPassages, () => {
        // onLongPassages(longPassages.value);
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
            // onCellSize(cellSize.value);
        }
        if (imgWidth !== imageWidth.value) {
            imageWidth.value = imgWidth;
            // onImageWidth(imageWidth.value);
        }
        if (imgHeight !== imageHeight.value) {
            imageHeight.value = imgHeight;
            // onImageHeight(imageHeight.value);
        }
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

    function reset() {
        mazeWidth.value = DEFAULT_MAZE_SIZE;
        mazeHeight.value = DEFAULT_MAZE_SIZE;
        loopPct.value = DEFAULT_LOOP_PCT;
        crossPct.value = DEFAULT_CROSS_PCT;
        longPassages.value = DEFAULT_LONG_PASSAGES;
    }

    return { mazeWidth, mazeHeight, loopPct, crossPct, longPassages, cellSize, imageWidth, imageHeight, reset };
});