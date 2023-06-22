<template>
    <div
        class="storm-conversation-softlight"
        v-if="conversation.effType === ReverseConversationEffectType.SoftLight"
    >
        {{ stripTags(conversation.diaTexts[0]) }}
    </div>
    <template v-else>
        <div
            v-if="conversation.type !== ReverseConversationType.NoInteract"
            class="storm-conversation-next"
            @click="next"
        ></div>
        <div class="storm-conversation-normal">
            <div class="storm-conversation-left">
                <div v-if="conversation.iconShow" class="storm-conversation-headicon">
                    <img :src="assetByName(conversation.heroIcon)" alt="" />
                </div>
                <div
                    v-if="conversation.type === ReverseConversationType.Player"
                    class="storm-conversation-vertin"
                ></div>
            </div>
            <div class="storm-conversation-right">
                <div class="storm-conversation-names">
                    <div class="storm-conversation-cnname">{{ conversation.heroNames[0] }}</div>
                    <div v-if="conversation.nameEnShow" class="storm-conversation-sepname">/</div>
                    <div v-if="conversation.nameEnShow" class="storm-conversation-enname">
                        {{ conversation.heroNames[2] }}
                    </div>
                </div>
                <div class="storm-conversation-split"></div>
                <div class="storm-conversation-text">
                    {{ stripTags(conversation.diaTexts[0]) }}
                </div>
            </div>
        </div>
    </template>
</template>

<script setup lang="ts">
import { inject } from 'vue'
import {
    type ReverseStory,
    ReverseConversationType,
    ReverseConversationEffectType
} from '../../typing'
const assetByName = inject('assetByName') as (name: string) => string
const next = inject('next') as () => void
const props = defineProps<{
    conversation: ReverseStory['conversation']
}>()
const stripTags = (str: string) => str.replace(/<[^>]+>/g, '')
</script>

<style>
.storm-conversation-softlight {
    position: absolute;
    bottom: 15px;
    left: 0;
    right: 0;
    z-index: 501;
    text-align: center;
    text-shadow: 0 0 1px rgba(255, 255, 255, 0.5), 0 0 2px rgba(255, 255, 255, 0.5),
        0 0 3px rgba(255, 255, 255, 0.5), 0 0 20px rgba(255, 255, 255, 0.8);
    color: rgba(255, 255, 255, 0.8);
    font-size: 14px;
}
.storm-conversation-normal {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 502;
    height: 100px;
    background: linear-gradient(0, #261f1f, 10%, #261f1fee, 40%, #261f1fcc, 90%, transparent);
    display: flex;
    justify-content: center;
    align-items: center;
}
.storm-conversation-next {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 599;
    cursor: pointer;
    outline: 0;
    -webkit-tap-highlight-color: transparent;
}
.storm-conversation-names {
    color: #d9cdc3;
}

.storm-conversation-right {
    min-width: 500px;
}

.storm-conversation-enname {
    font-size: 12px;
    zoom: 0.8;
    vertical-align: bottom;
    letter-spacing: 2px;
    opacity: 0.5;
}

.storm-conversation-names {
    display: flex;
    vertical-align: bottom;
    align-items: flex-end;
    letter-spacing: 1px;
}

.storm-conversation-cnname {
    vertical-align: bottom;
    font-size: 17px;
}

.storm-conversation-sepname {
    font-size: 12px;
    zoom: 0.9;
    padding: 0 5px;
    opacity: 0.5;
}

.storm-conversation-text {
    font-size: 12px;
    min-height: 45px;
    color: #c6c5bf;
}

.storm-conversation-split {
    background: transparent no-repeat center;
    background-size: 100% 1px;
    background-image: url(@/assets/player/wenzifenge.png);
    width: 100%;
    height: 1px;
    margin: 7px 0;
}
.storm-conversation-headicon img {
    width: 55px;
    height: 55px;
    object-fit: contain;
    border: 1px solid #3d3935;
}

.storm-conversation-headicon {
    margin-top: -6px;
    padding-right: 30px;
    margin-left: -43px;
}
</style>
