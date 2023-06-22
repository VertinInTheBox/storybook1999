<template>
    <div class="storm-video-controller">
        <video
            ref="currentVideoRefList"
            :data-video="i.video"
            v-for="i in currentVideoList"
            :key="i.video"
            :src="assetByName(i.video)"
            :style="{ zIndex: 200 + i.layer * 10 }"
            preload="auto"
            muted
        ></video>
    </div>
</template>

<script setup lang="ts">
import { ref, watch, inject, nextTick, watchEffect, reactive } from 'vue'
import { ReverseVideoOrderType, type ReverseStory, type ReverseVideo } from '../../typing'
import { _runtick, tick, videoPlaying } from '../clock'
const props = defineProps<{
    videoList: ReverseStory['videoList']
}>()
const currentVideoList = ref([] as ReverseVideo[])
const currentVideoRefList = ref([] as HTMLVideoElement[])
const assetByName = inject('assetByName') as (name: string) => string
watchEffect(() => {
    const list = props.videoList || []
    for (const item of list) {
        switch (item.orderType) {
            case ReverseVideoOrderType.Produce:
                currentVideoList.value.push(item)
                const vt = item.video
                nextTick()
                    .then(tick)
                    .then(() => {
                        const video = currentVideoRefList.value.find((i) => i.dataset.video === vt)
                        if (video) {
                            video.muted = true
                            video.play()
                            videoPlaying.value = true
                        }
                    })
                break
            case ReverseVideoOrderType.Destroy:
                currentVideoList.value = currentVideoList.value.filter(
                    (video) => video.video !== item.video
                )
                videoPlaying.value = currentVideoList.value.length > 0
                break
            case ReverseVideoOrderType.Pause:
                currentVideoRefList.value.find((i) => i.dataset.video === vt)?.pause()
                break
            case ReverseVideoOrderType.Restart:
                nextTick()
                    .then(tick)
                    .then(() => {
                        currentVideoRefList.value.find((i) => i.dataset.video === vt)?.play()
                    })
                break
        }
    }
})
</script>

<style lang="scss">
.storm-video-controller {
    width: 100%;
    height: 100%;
    position: absolute;
    overflow: hidden;
    z-index: 200;

    video {
        position: absolute;
        width: 100%;
        height: 100%;
        object-fit: cover;
    }
}
</style>
