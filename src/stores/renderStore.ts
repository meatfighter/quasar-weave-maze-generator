import panzoom, { PanZoom, Transform } from 'panzoom';
import { ref, watch } from 'vue';
import { defineStore } from 'pinia';

export const useRenderStore = defineStore('render', () => {
    const url = ref('');
    const processing = ref(false);

    const svgContainer = ref<HTMLDivElement | null>(null);
    const svgImage = ref<HTMLImageElement | null>(null);

    let lastWidth = 0;
    let lastHeight = 0;
    let lastTransform: Transform = { x: 0, y: 0, scale: 1 };
    let panzoomInstance: PanZoom | null = null;

    function centerImage() {
        lastWidth = 0;
        lastHeight = 0;
        lastTransform = { x: 0, y: 0, scale: 1 };
        _centerImage();
    }

    function _centerImage() {
        if (!(svgContainer.value && svgImage.value)) {
            lastWidth = 0;
            lastHeight = 0;
            lastTransform = { x: 0, y: 0, scale: 1 };
            if (panzoomInstance) {
                panzoomInstance.dispose();
            }
            panzoomInstance = null;
            return;
        }

        const containerRect = svgContainer.value.getBoundingClientRect();
        let w1 = svgImage.value.width;
        let h1 = svgImage.value.height;
        let w2 = svgImage.value.width;
        let h2 = svgImage.value.height;

        if (w1 > containerRect.width) {
            w1 = containerRect.width;
            h1 = w1 * svgImage.value.height / svgImage.value.width;
        }
        if (h1 > containerRect.height) {
            h1 = containerRect.height;
            w1 = h1 * svgImage.value.width / svgImage.value.height;
        }

        if (h2 > containerRect.height) {
            h2 = containerRect.height;
            w2 = h2 * svgImage.value.width / svgImage.value.height;
        }
        if (w2 > containerRect.width) {
            w2 = containerRect.width;
            h2 = w2 * svgImage.value.height / svgImage.value.width;
        }

        let width = w1;
        let height = h1;
        if (w2 > w1) {
            width = w2;
            height = h2;
        }

        if (panzoomInstance) {
            panzoomInstance.dispose();
        }
        panzoomInstance = panzoom(svgImage.value);

        if (lastWidth !== svgImage.value.width || lastHeight !== svgImage.value.height) {
            lastWidth = svgImage.value.width;
            lastHeight = svgImage.value.height;
            if (width !== svgImage.value.width) {
                panzoomInstance.zoomTo(0, 0, width / svgImage.value.width);
            }
            panzoomInstance.moveTo((containerRect.width - width) / 2, (containerRect.height - height) / 2);
        } else {
            panzoomInstance.zoomTo(0, 0, lastTransform.scale);
            panzoomInstance.moveTo(lastTransform.x, lastTransform.y);
        }
        lastTransform = panzoomInstance.getTransform();
    }

    watch(url, () => {
        if (!svgImage.value) {
            lastWidth = 0;
            lastHeight = 0;
            lastTransform = { x: 0, y: 0, scale: 1 };
            if (panzoomInstance) {
                panzoomInstance.dispose();
            }
            panzoomInstance = null;
            return;
        }
        svgImage.value.onload = _centerImage;
        svgImage.value.src = url.value;
    });

    return { url, processing, svgContainer, svgImage, centerImage };
});