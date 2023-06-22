<template>
    <div class="storm-bg-img">
        <img v-if="bgImg" :src="assetByName(bgImg)" alt="" />
    </div>
</template>

<script setup lang="ts">
import { ref, watch, inject } from 'vue'
import type { ReverseStory } from '../../typing'
const props = defineProps<{
    bg: ReverseStory['bg']
}>()
const assetByName = inject('assetByName') as (name: string) => string
const bgImg = ref(props.bg.bgImg || '')
watch(
    () => props.bg,
    () => {
        bgImg.value = props.bg.bgImg || bgImg.value
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
}
</style>
