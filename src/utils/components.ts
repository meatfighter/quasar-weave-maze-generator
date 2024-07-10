import { Ref } from 'vue';

// Example usage:
//
// const resetElement = ref<HTMLElement | null>(null);
//
// <div class="row" ref="resetElement">
//     <q-btn class="col" icon="refresh" rounded color="primary" no-caps label="Reset"/>
// </div>

export function makeEqualWidths(elements: Ref<HTMLElement | null>[]) {
    let maxWidth = 0;
    for (const element of elements) {
        if (!element.value) {
            return;
        }
        maxWidth = Math.max(maxWidth, element.value.offsetWidth);
    }
    for (const element of elements) {
        if (element.value) {
            element.value.style.width = `${maxWidth}px`;
        }
    }
}