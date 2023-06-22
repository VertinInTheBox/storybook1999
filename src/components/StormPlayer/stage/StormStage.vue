<template>
    <article class="storm-stage">
        <ConversatonController :conversation="step?.conversation || {}" />
        <VideoController :videoList="step?.videoList || []" />
        <AudioController :audioList="step?.audioList || []" />
        <BgImg :bg="step?.bg" />
        <div class="storm-clock-click" v-if="!clockRunning">
            <div class="storm-clock-click__inner">请点击屏幕继续</div>
        </div>
    </article>
</template>

<script setup lang="ts">
import { ReverseConversationType, type ReverseStory } from '../typing'
import ConversatonController from './Conversation/ConversationController.vue'
import VideoController from './Video/VideoController.vue'
import AudioController from './Audio/AudioController.vue'
import BgImg from './Image/BgImg.vue'
import { _runtick, clockRunning, tick, tickDelay } from './clock'
import { ref, watchEffect, onMounted, onBeforeUnmount } from 'vue'
import { nextTick } from 'vue'
const props = defineProps<{
    step: ReverseStory
}>()
const emit = defineEmits(['next'])
const lastStep = ref<ReverseStory>(props.step)
watchEffect(async () => {
    if (props.step.conversation.type === ReverseConversationType.None) {
        await nextTick()
        await tick()
        if (props.step.conversation.delayTimes[0] > 0) {
            await tickDelay(props.step.conversation.delayTimes[0] * 1000)
        }
        console.log('next')
        emit('next')
        return
    }
    lastStep.value = props.step
})
let running = false
const rafTick = () => {
    if (running) {
        _runtick()
        requestAnimationFrame(rafTick)
    }
}
const intervalTick = () => {
    if (running) {
        _runtick()
        setTimeout(intervalTick, 100)
    }
}
onMounted(() => {
    running = true
    rafTick()
    intervalTick()
})
onBeforeUnmount(() => {
    running = false
})
</script>

<style lang="scss">
.storm-stage {
    width: 100%;
    height: 100%;
    position: relative;
    overflow: hidden;
    background: #000;
    color: #fff;
}
.storm-clock-click {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 1000;
    background: rgba(0, 0, 0, 0.5);
    color: #fff;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 12px;
}
</style>
