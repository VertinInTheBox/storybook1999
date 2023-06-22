import type { ReverseStory } from './typing'
const root = [
    'id',
    'name',
    'conversation',
    'heroList',
    'bg',
    'audioList',
    'effList',
    'picList',
    'videoList',
    'navigateList',
    'optList',
    'mainRole',
    'mourningBorder'
]
const children = {
    conversation: [
        'type',
        'delayTimes',
        'isAuto',
        'effType',
        'effLv',
        'effTimes',
        'effRate',
        'showList',
        'nameShow',
        'nameEnShow',
        'heroNames',
        'iconShow',
        'heroIcon',
        'audio',
        'diaTexts',
        'showTimes',
        'keepTimes'
    ],
    heroList: ['heroIndex', 'heroDir', 'isFollow', 'mouths', 'anims', 'expressions', 'effs'],
    bg: [
        'bgType',
        'bgImg',
        'transType',
        'darkTimes',
        'waitTimes',
        'fadeTimes',
        'offsetX',
        'offsetY',
        'angle',
        'scale',
        'transTimes',
        'effType',
        'effDegree',
        'effTimes',
        'effRate'
    ],
    audioList: ['audio', 'audioState', 'delayTimes', 'orderType', 'volume', 'transTimes', 'count'],
    effList: [
        'effect',
        'delayTimes',
        'orderType',
        'inType',
        'inTimes',
        'outType',
        'outTimes',
        'posX',
        'posY',
        'layer'
    ],
    picList: [
        'picType',
        'cirRadius',
        'picColor',
        'picture',
        'delayTimes',
        'orderType',
        'inType',
        'outType',
        'outTimes',
        'posX',
        'posY',
        'layer',
        'effType',
        'effDegree',
        'effTimes',
        'effRate'
    ],
    videoList: ['video', 'delayTimes', 'orderType', 'loop', 'layer'],
    navigateList: ['navigateType', 'navigateTxts', 'navigateChapterEn', 'navigateLogo'],
    optList: [
        'condition',
        'conditionType',
        'conditionValue',
        'branchTxts',
        'type',
        'feedbackType',
        'feedbackValue',
        'back'
    ],
    mainRole: ['mouths', 'anims', 'expressions'],
    mourningBorder: ['borderType', 'borderTimes']
} as Record<string, string[]>

export const parseStory = (jsonarr: any): ReverseStory[] => {
    const setkey = (obj: Record<string, any>, keylist: string[], arr: any[]) => {
        keylist.forEach((key, index) => {
            obj[key as any] = arr[index]
        })
        return obj
    }
    const items = jsonarr[2]
    const group = jsonarr[3]
    const mapitem = items.map((item: any) => {
        const obj = setkey({}, root, item)
        try {
            obj.next = group.find((g: any) => g[0] && g[0][0] && g[0][0] === obj.id)
        } catch (e) {}
        for (const key of Object.keys(children)) {
            if (!key.endsWith('List')) {
                obj[key] = setkey({}, children[key], obj[key])
            } else {
                const keyarr = obj[key]
                obj[key] = keyarr.map((item: any) => {
                    return setkey({}, children[key], item)
                })
            }
        }
        return obj
    })
    return mapitem
}

export const getFirstStep = (story: ReverseStory[]): number => {
    // no next point to
    let ids = story.map((item) => item.id)
    const nexts = story.map((item) => item.next)
    nexts.forEach((next) => {
        if (next && next.length > 0) {
            next.forEach((n) => {
                ids = ids.filter((id) => id !== n[1])
            })
        }
    })
    if (ids.length === 0) {
        throw new Error('no first step')
    }
    if (ids.length > 1) {
        throw new Error('more than one first step')
    }
    return ids[0]
}
