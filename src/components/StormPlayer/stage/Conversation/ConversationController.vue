<template>
    <template v-if="convShow && conversation.type !== ReverseConversationType.None">
        <Conversation :conversation="conversation" />
    </template>
</template>

<script setup lang="ts">
import { ref, inject, watch, onBeforeUnmount } from 'vue'
import { type ReverseStory, ReverseConversationType } from '../../typing'
import Conversation from './Conversation.vue'
import { clock, tick, videoPlaying } from '../clock'
import { Howl } from 'howler'
import { nextTick } from 'vue'
const props = defineProps<{
    conversation: ReverseStory['conversation']
}>()
const assetByName = inject('assetByName') as (name: string) => string
const next = inject('next') as () => void
let startTick = performance.now()
const convShow = ref(true)
const nextInvoked = ref(false)
let conversationHowl: Howl | null = null
watch(
    () => props.conversation,
    () => {
        startTick = performance.now()
        convShow.value = true
        nextInvoked.value = false
        if (conversationHowl) {
            conversationHowl.stop()
            conversationHowl = null
        }
        nextTick()
            .then(tick)
            .then(() => {
                if (!videoPlaying.value && props.conversation.audio) {
                    conversationHowl = new Howl({
                        src: [assetByName(props.conversation.audio.toString()).toString()],
                        format: ['ogg'],
                        loop: false,
                        autoplay: false
                    })
                    conversationHowl?.play()
                }
            })
    }
)
const onTick = () => {
    if (props.conversation.type === ReverseConversationType.NoInteract && !nextInvoked.value) {
        const tickTimes = performance.now() - startTick
        const keepTimes = props.conversation.keepTimes[0] * 1001
        const nextTime = props.conversation.delayTimes[0] * 1001
        const effTime = props.conversation.effTimes[0] * 1001
        const showTime = props.conversation.showTimes[0] * 1001
        if (tickTimes > nextTime) {
            next()
            nextInvoked.value = true
        }
    }
}
clock.on('tick', onTick)
onBeforeUnmount(() => {
    clock.off('tick', onTick)
})
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
