import { EventEmitter } from 'eventemitter3'
import { Howl, Howler } from 'howler'
import { ref } from 'vue'
export const clock = new EventEmitter()
export const clockRunning = ref(false)
export const videoPlaying = ref(false)
new Howl({
    src: ['']
})
export const _runtick = () => {
    if (!Howler.ctx) return
    if (Howler.ctx.state !== 'running') return
    clockRunning.value = true
    clock.emit('tick')
}

export const tick = () => {
    return new Promise<void>((resolve) => {
        clock.once('tick', () => {
            resolve()
        })
    })
}

export const tickDelay = async (delay: number) => {
    const now = performance.now()
    while (performance.now() - now < delay) {
        await tick()
    }
}

export const untilNext = async () => {
    return new Promise<void>((resolve) => {
        clock.once('next', () => {
            resolve()
        })
    })
}
