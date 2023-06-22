<template>
    <div class="storm-bg-img">
        <img
            v-if="bgImg && bgImg.bgImg"
            :src="assetByName(bgImg.bgImg)"
            alt=""
            :style="{ transform, transition }"
        />
    </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, inject } from 'vue'
import type { ReverseStory } from '../../typing'
import { asset, type Asset } from '@xytoki/asset-loader'
const props = defineProps<{
    bg: ReverseStory['bg']
}>()
const assetByName = inject('assetByName') as (name: string) => string
const bgImg = ref(props.bg || '')
const transform = computed(() => {
    if (!bgImg || !bgImg.value.bgImg) return ''
    try {
        const asset = assetByName(bgImg.value.bgImg) as unknown as Asset
        const width = asset.imageElement.width
        const height = asset.imageElement.height
        const offsetX = bgImg.value.offsetX
        const offsetY = bgImg.value.offsetY
        const scale = bgImg.value.scale
        // convert to percent
        const x = offsetX / width
        const y = offsetY / height
        return `translate(${x * 100}%, ${0 - y * 100}%) scale(${scale})`
    } catch (e) {
        console.log(e)
    }
})
const transition = computed(() => {
    if (!bgImg || !bgImg.value.bgImg) return ''
    try {
        const trans = bgImg.value.transTimes[0]
        return `transform ${trans}s`
    } catch (e) {}
})
watch(
    () => props.bg,
    () => {
        bgImg.value = props.bg && props.bg.bgImg ? props.bg : bgImg.value
    }
)
</script>

<style scoped lang="scss">
.storm-bg-img {
    width: 100%;
    height: 100%;
    position: absolute;
    overflow: hidden;
    z-index: 100;
}

.storm-bg-img img {
    position: absolute;
    width: 100%;
    height: 100%;
    object-fit: cover;
    will-change: transform;
    transition: transform 1s;
}
</style>
