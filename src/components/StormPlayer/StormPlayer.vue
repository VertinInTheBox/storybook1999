<template>
    <StormStage v-if="currentStep" :step="currentStep" @next="_next" />
</template>

<script setup lang="ts">
import type { ReverseStory } from './typing'
import StormStage from './stage/StormStage.vue'
import { computed } from 'vue'
import { provide } from 'vue'
import { clock } from './stage/clock';
const props = defineProps<{
    story: ReverseStory[]
    modelValue: number
}>()
const emit = defineEmits(['update:modelValue'])
const currentStep = computed(() => {
    if (props.story) {
        return props.story.find((step) => step.id === props.modelValue)
    }
    return
})
const _next = (step: number) => {
    if (step) {
        emit('update:modelValue', step)
    }
    const next = currentStep.value?.next
    console.log(next)
    if (next && next.length === 1 && next[0][1]) {
        emit('update:modelValue', next[0][1])
    }
    clock.emit('next')
}
provide('next', _next)
</script>
