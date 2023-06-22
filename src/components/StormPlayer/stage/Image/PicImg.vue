<template>
    <div class="storm-pic-controller">
        <div
            class="storm-pic-item"
            :class="`storm-pic-item-${ReversePictureType[i.picType].toLowerCase()}`"
            :style="{ zIndex: 300 + i.layer * 10 }"
            v-for="i in currentPicList"
            :key="i.picture"
        >
            <img v-if="i.picture" :src="assetByName(i.picture)" alt="" />
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ref, inject, watchEffect } from 'vue'
import {
    type ReverseStory,
    type ReversePic,
    ReversePictureType,
    ReversePictureOrderType
} from '../../typing'
import { untilNext } from '../clock'
const props = defineProps<{
    picList: ReverseStory['picList']
}>()
const currentPicList = ref([] as ReversePic[])
const assetByName = inject('assetByName') as (name: string) => string
watchEffect(() => {
    const list = props.picList || []
    for (const item of list) {
        switch (item.orderType) {
            case ReversePictureOrderType.Produce:
                currentPicList.value.push(item)
                break
            case ReversePictureOrderType.Destroy:
                untilNext().then(() => {
                    currentPicList.value = currentPicList.value.filter(
                        (pic) => pic.picture !== item.picture
                    )
                })
                break
        }
    }
})
</script>

<style lang="scss">
.storm-pic-item-float {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    padding-bottom: 80px;
    display: flex;
    justify-content: center;
    align-items: center;
    background: rgba(0, 0, 0, 0.5);
    img {
        width: 60vw;
        height: 60vh;
        object-fit: contain;
    }
}
.storm-pic-item-normal {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }
}
</style>
