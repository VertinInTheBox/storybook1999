<template>
    <div class="storm-audio-controller"></div>
</template>

<script setup lang="ts">
import { Howl } from 'howler'
import { ref, watchEffect } from 'vue'
import { ReverseAudioOrderType, type ReverseStory, type ReverseAudio } from '../../typing'
import { inject } from 'vue'
import { clock } from '../clock'
const props = defineProps<{
    audioList: ReverseStory['audioList']
}>()
const currentAudioList = ref({} as Record<string, Howl>)
const assetByName = inject('assetByName') as (name: string) => string
watchEffect(() => {
    const list = props.audioList || []
    for (const item of list) {
        console.log(item)
        switch (item.orderType) {
            case ReverseAudioOrderType.Single:
                currentAudioList.value[item.audio] = new Howl({
                    src: [assetByName(item.audio.toString()).toString()],
                    format: ['ogg'],
                    loop: false,
                    autoplay: false
                })
                clock.once('tick', () => {
                    currentAudioList.value[item.audio].play()
                })
                break
            case ReverseAudioOrderType.Continuity:
                currentAudioList.value[item.audio] = new Howl({
                    src: [assetByName(item.audio.toString()).toString()],
                    format: ['ogg'],
                    loop: true,
                    autoplay: false
                })
                clock.once('tick', () => {
                    currentAudioList.value[item.audio].play()
                })
                break
            case ReverseAudioOrderType.Destroy:
                const audio = item.audio
                clock.once('next', () => {
                    try {
                        currentAudioList.value[audio].stop()
                    } catch (e) {}
                    delete currentAudioList.value[audio]
                })
                break
            case ReverseAudioOrderType.Adjust:
                console.log('adjust', item)
                break
        }
    }
})
</script>

<style lang="scss"></style>
