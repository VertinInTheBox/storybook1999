<template>
    <div class="storm-video-controller">
        <video
            ref="currentVideoRefList"
            :data-video="i.video"
            v-for="i in currentVideoList"
            :key="i.video"
            :src="assetByName(i.video)"
            :style="{ zIndex: 200 + i.layer * 10 }"
            :loop="i.loop"
            :poster="transparentImg"
            @ended="onVideoEnd"
            preload="auto"
            muted
        ></video>
    </div>
</template>

<script setup lang="ts">
import { ref, inject, watchEffect } from 'vue'
import { ReverseVideoOrderType, type ReverseStory, type ReverseVideo } from '../../typing'
import { _runtick, domTick, untilNext, videoPlaying } from '../clock'
const props = defineProps<{
    videoList: ReverseStory['videoList']
}>()
const currentVideoList = ref([] as ReverseVideo[])
const currentVideoRefList = ref([] as HTMLVideoElement[])
const transparentImg = ref('')
const canvas = document.createElement('canvas')
canvas.width = 1
canvas.height = 1
canvas.style.position = 'absolute'
canvas.style.top = '-100%'
canvas.style.left = '-100%'
canvas.style.zIndex = '-100'
document.body.appendChild(canvas)
const ctx = canvas.getContext('2d')!
ctx.fillStyle = 'rgba(0,0,0,0)'
ctx.fillRect(0, 0, 1, 1)
transparentImg.value = canvas.toDataURL()
document.body.removeChild(canvas)
const assetByName = inject('assetByName') as (name: string) => string
const onVideoEnd = (e: Event) => {
    const video = e.target as HTMLVideoElement
    videoPlaying.value = false
    if (currentVideoRefList.value.length > 1) {
        video.style.opacity = '0'
    }
}
watchEffect(() => {
    const list = props.videoList || []
    for (const item of list) {
        switch (item.orderType) {
            case ReverseVideoOrderType.Produce:
                currentVideoList.value.push(item)
                const vt = item.video
                domTick().then(() => {
                    const video = currentVideoRefList.value.find((i) => i.dataset.video === vt)
                    if (video) {
                        video.style.opacity = '1'
                        video.muted = true
                        video.play()
                        videoPlaying.value = true
                    }
                })
                break
            case ReverseVideoOrderType.Destroy:
                untilNext().then(() => {
                    currentVideoList.value = currentVideoList.value.filter(
                        (video) => video.video !== item.video
                    )
                    videoPlaying.value = currentVideoList.value.length > 0
                })
                break
            case ReverseVideoOrderType.Pause:
                currentVideoRefList.value.find((i) => i.dataset.video === vt)?.pause()
                break
            case ReverseVideoOrderType.Restart:
                domTick().then(() => {
                    const video = currentVideoRefList.value.find((i) => i.dataset.video === vt)
                    if (video) {
                        video.style.opacity = '1'
                        video.muted = true
                        video.play()
                        videoPlaying.value = true
                    }
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
        background: #000;
        transition: opacity 0.2s;
    }
}
</style>
