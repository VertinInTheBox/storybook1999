<template>
    <main class="player-index">
        <section class="loading" :class="{ hide: !loading }">
            <div class="clock-click" v-if="clockWait && !clockRunning">
                <div class="clock-click__inner">点击屏幕开始</div>
            </div>
            <div class="intro">
                <div class="intro-header">暴雨</div>
                <div class="intro-line">
                    <div class="intro-line-sep intro-line-sep-1"></div>
                    <div class="intro-line-sep intro-line-sep-2"></div>
                    <div class="intro-line-sep intro-line-sep-3"></div>
                    <div class="intro-line-sep intro-line-sep-4"></div>
                </div>
                <div class="intro-subtitle">The Storm</div>
                <div class="intro-text">
                    它的到来让时间变得无足轻重。时而回到过去，时而重返未来。又或是一无所有，又或是浴火重生。
                </div>
            </div>
            <div class="progress">
                <div class="progress-bar" :style="{ width: `${totalProgress}%` }"></div>
            </div>
            <div class="loading-text">{{ loadingText }}</div>
        </section>
        <section class="stage-wrapper">
            <StormPlayer
                :story="currentStorySteps"
                :model-value="currentStep"
                @update:model-value="router.replace({ query: { ...route.query, step: $event } })"
            />
        </section>
    </main>
</template>

<script setup lang="ts">
import { getFirstStep, parseStory } from '@/components/StormPlayer/parseStory'
import { computed } from 'vue'
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { AssetLoader } from '@xytoki/asset-loader'
import type { ReverseStory } from '@/components/StormPlayer/typing'
import StormPlayer from '@/components/StormPlayer/StormPlayer.vue'
import { provide } from 'vue'
import { clock, clockRunning } from '@/components/StormPlayer/stage/clock'
const clockWait = ref(false)
const loadingText = ref('正在加载剧情数据')
const route = useRoute()
const router = useRouter()
const storyIds = (route.params.id || '')
    .toString()
    .split(',')
    .map((id) => parseInt(id))
    .filter((id) => !isNaN(id))
const loadProgress = ref(0)
const dataProgress = ref(0)
const miscProgress = ref(0)
const loading = ref(true)
const stageLoader = new AssetLoader()
const storyList = ref({} as Record<number, ReverseStory[]>)
const currentStorySteps = computed(() => {
    return storyList.value[currentStory.value]
})
const currentStep = computed(() => {
    return route.query.step ? parseInt(route.query.step.toString()) : -1
})
const currentStory = computed(() => {
    return route.query.story ? parseInt(route.query.story.toString()) : storyIds[0]
})
const totalProgress = computed(() => {
    return loadProgress.value * 0.15 + dataProgress.value * 0.7 + miscProgress.value * 0.15
})
const fetchStory = async (id: string) => {
    const res = await fetch(`https://foundation.vertin.one/story/${id}.json`)
    const data = await res.json()
    return data
}
const urlByName = (name: string, type: string) => {
    return `https://foundation.vertin.one/${type}/${name
        .replace('.jpg', '.webp')
        .replace('.png', '.webp')}`
}
const assetMap = ref({} as Record<string, string>)
const assetByName = (name: string) => {
    return stageLoader.get(assetMap.value[name])
}
provide('assetByName', assetByName)
;(async () => {
    const storyData = await Promise.all(
        storyIds.map(async (id, index) => {
            const story = await fetchStory(id.toString())
            loadingText.value = `正在加载剧情 (${index + 1}/${storyIds.length})`
            loadProgress.value = ((index + 1) / storyIds.length) * 100
            return await parseStory(story)
        })
    )
    const resMap = {} as Record<string, string>
    storyData.forEach((storyarr) => {
        storyarr.forEach((story) => {
            if (story.bg?.bgImg) {
                resMap[story.bg.bgImg] = urlByName(story.bg.bgImg, 'bg')
            }
            if (story.conversation?.heroIcon) {
                resMap[story.conversation?.heroIcon] = urlByName(story.conversation?.heroIcon, 'bg')
            }
            if (story.conversation?.audio) {
                resMap[story.conversation.audio.toString()] = urlByName(
                    story.conversation.audio.toString() + '.ogg',
                    'audio'
                )
            }
            story.picList.forEach((pic) => {
                if (pic.picture) {
                    resMap[pic.picture] = urlByName(pic.picture, 'bg')
                }
            })
            story.audioList.forEach((audio) => {
                if (audio.audio) {
                    resMap[audio.audio.toString()] = urlByName(
                        audio.audio.toString() + '.ogg',
                        'audio'
                    )
                }
            })
            story.videoList.forEach((video) => {
                if (video.video) {
                    resMap[video.video] = urlByName(video.video, 'video')
                }
            })
        })
    })
    assetMap.value = {
        ...assetMap.value,
        ...resMap
    }
    for (const key in resMap) {
        stageLoader.push(resMap[key])
    }
    loadingText.value = '正在加载资源'
    Object.values(stageLoader.store).forEach((item) => {
        // @ts-ignore
        const f = item.fetch.bind(item)
        // @ts-ignore
        item.fetch = async () => {
            try {
                // @ts-ignore
                await f()
            } catch (e) {
                if ((e as Error).message.startsWith('404')) {
                    item.blob = new Blob()
                } else {
                    throw e
                }
            }
        }
    })
    loadingText.value = `正在加载资源 (0/${Object.keys(stageLoader.store).length})`
    await stageLoader.ensure((cur, tot) => {
        loadingText.value = `正在加载资源 (${cur}/${tot})`
        dataProgress.value = (cur / tot) * 100
    })
    loadingText.value = '初始化中，很快就好'
    // if not safari
    if (!/Safari/.test(navigator.userAgent) || /Chrome/.test(navigator.userAgent)) {
        miscProgress.value = 98
    }
    storyData.forEach((storyarr, index) => {
        storyList.value[storyIds[index]] = storyarr
    })
    router.replace({
        query: {
            ...route.query,
            story: currentStory.value,
            step:
                currentStep.value < 0
                    ? getFirstStep(storyList.value[storyIds[0]])
                    : currentStep.value
        }
    })
    await new Promise((resolve) => setTimeout(resolve, 500))
    clockWait.value = true
    clock.once('tick', () => {
        loading.value = false
    })
})()
</script>

<style scoped lang="scss">
.player-index {
    width: 100%;
    height: 100%;
    position: relative;
}

@media screen and (orientation: portrait) {
    .player-index {
        width: 100vmax;
        height: 100vmin;
        transform-origin: top left;
        transform: rotate(90deg) translate(0, -100vmin);
    }
}
.loading {
    background: transparent no-repeat center;
    background-image: url('@/assets/loading.webp');
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 99;
    background-size: cover;
    opacity: 1;
    transition: opacity 0.3s;
    &.hide {
        opacity: 0;
        pointer-events: none;
    }
    .loading-text {
        position: absolute;
        left: 0;
        right: 0;
        bottom: 0;
        height: 55px;
        color: #fff;
        font-size: 12px;
        text-align: center;
        display: flex;
        opacity: 0.7;
        align-items: center;
        justify-content: center;
        padding-bottom: 2px;
    }

    .progress {
        position: absolute;
        left: 0;
        right: 0;
        bottom: 55px;
        height: 2px;
        &:after {
            content: ' ';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            border-bottom: 2px dotted transparent;
        }

        .progress-bar {
            width: 0;
            height: 100%;
            background: rgba(255, 255, 255, 0.6);
            position: relative;
            z-index: 3;
        }
    }
    .intro {
        position: absolute;
        bottom: 75px;
        color: rgba(255, 255, 255, 0.7);
        font-size: 12px;
        left: 50px;
    }

    .intro-header {
        font-size: 20px;
        color: #fff;
    }

    .intro-line {
        width: 160px;
        height: 1px;
        position: relative;
        display: flex;
        align-items: flex-start;
        margin: 6px 0;
        margin-bottom: 2px;
    }

    .intro-line-sep {
        background: rgba(255, 255, 255, 0.6);
        width: 10px;
        height: 1px;
    }

    .intro-line-sep-2 {
        width: 130px;
        margin-left: 2px;
    }

    .intro-line-sep-3 {
        width: 4px;
        margin-left: 2px;
    }

    .intro-line-sep-4 {
        margin-left: 2px;
    }

    .intro-text {
        margin-top: 8px;
    }
}
.stage-wrapper {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 2;
}
.clock-click {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 1000;
    background: rgba(0, 0, 0, 0.8);
    color: #fff;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 12px;
}
</style>
