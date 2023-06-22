export interface ReverseStory {
    id: number
    next: ReverseNext[]
    name: string
    conversation: ReverseConversation
    heroList: ReverseHero[]
    bg: ReverseBg
    audioList: ReverseAudio[]
    effList: ReverseEff[]
    picList: ReversePic[]
    videoList: ReverseVideo[]
    navigateList: ReverseNavigate[]
    optList: ReverseOpt[]
    mainRole: ReverseMainRole
    mourningBorder: ReverseMourningBorder
}
export type ReverseNext = [number, number, string]
export interface ReverseConversation {
    type: ReverseConversationType
    delayTimes: number[]
    isAuto: false
    effType: ReverseConversationEffectType
    effLv: number
    effTimes: number[]
    effRate: number
    showList: number[]
    nameShow: boolean
    nameEnShow: boolean
    heroNames: string[]
    iconShow: boolean
    heroIcon: string
    audio: number
    diaTexts: string[]
    showTimes: number[]
    keepTimes: number[]
}
export interface ReverseHero {
    heroIndex: number
    heroDir: ReverseHeroPos // 0 1 2 left middle right
    isFollow: boolean
    mouths: string[]
    anims: string[]
    expressions: string[]
    effs: string[]
}
export interface ReverseBg {
    bgType: ReverseBgType
    bgImg: string
    transType: ReverseBgTransType
    darkTimes: number[]
    waitTimes: number[]
    fadeTimes: number[]
    offsetX: number
    offsetY: number
    angle: number
    scale: number
    transTimes: number[]
    effType: ReverseBgEffectType
    effDegree: number
    effTimes: number[]
    effRate: number
}
export interface ReverseAudio {
    audio: number
    audioState: number
    delayTimes: number[]
    orderType: ReverseAudioOrderType
    volume: number
    transTimes: number[]
    count: number
}
export interface ReverseEff {
    effect: string
    delayTimes: number[]
    orderType: ReverseEffectOrderType
    inType: ReverseEffectInType
    inTimes: number[]
    outType: ReverseEffectOutType
    outTimes: number[]
    posX: number
    posY: number
    layer: number
}
export interface ReversePic {
    picType: ReversePictureType
    cirRadius: number
    picColor: string
    picture: string
    delayTimes: number[]
    orderType: ReversePictureOrderType
    inType: ReversePictureInType
    outType: ReversePictureOutType
    outTimes: number[]
    posX: number
    posY: number
    layer: number
    effType: ReversePictureEffectType
    effDegree: number
    effTimes: number[]
    effRate: number
}
export interface ReverseVideo {
    video: string
    delayTimes: number[]
    orderType: ReverseVideoOrderType
    loop: boolean
    layer: number
}
export interface ReverseNavigate {
    navigateType: ReverseNavigateType
    navigateTxts: string[]
    navigateChapterEn: string
    navigateLogo: string
}
export interface ReverseOpt {
    condition: number
    conditionType: number
    conditionValue: number
    branchTxts: string[]
    type: number
    feedbackType: number
    feedbackValue: number
    back: boolean
}
export interface ReverseMainRole {
    mouths: string[]
    anims: string[]
    expressions: string[]
}
export interface ReverseMourningBorder {
    borderType: ReverseBorderType
    borderTimes: number[]
}
export enum ReverseStepType {
    Interaction = 1,
    Normal = 0
}
export enum ReverseConversationType {
    Normal = 1,
    ScreenDialog = 5,
    Player = 4,
    NoInteract = 6,
    NoRole = 3,
    Aside = 2,
    None = 0
}
export enum ReverseConversationEffectType {
    Hard = 6,
    Magic = 7,
    SoftLight = 8,
    TwoLineShow = 5,
    LineByLine = 4,
    WordByWord = 3,
    Shake = 1,
    Fade = 2,
    None = 0
}
export enum ReverseHeroPos {
    Right = 2,      
    Middle = 1,
    Left = 0
}
export enum ReverseBgType {
    Effect = 1,
    Picture = 0
}
export enum ReverseBgTransType {
    WhiteFade = 4,
    DarkFade = 3,
    RightDarkFade = 6,
    Dissolve = 8,
    Keep = 0,
    UpDarkFade = 5,
    Fragmentate = 7,
    TransparencyFade = 2,
    Hard = 1
}
export enum ReverseBgEffectType {
    bgBlur = 1,
    FishEye = 2,
    FullBlur = 4,
    Shake = 3,
    None = 0
}
export enum ReverseAudioOrderType {
    Continuity = 0,
    Single = 1,
    Destroy = 2,
    Adjust = 3
}
export enum ReverseAudioInType {
    FadeIn = 1,
    Hard = 0
}
export enum ReverseAudioOutType {
    FadeOut = 1,
    Hard = 0
}
export enum ReverseEffectOrderType {
    Destroy = 2,
    ContinuityUnscale = 3,
    Single = 1,
    SingleUnscale = 4,
    Continuity = 0
}
export enum ReverseEffectInType {
    FadeIn = 1,
    Hard = 0
}
export enum ReverseEffectOutType {
    FadeOut = 1,
    Hard = 0
}
export enum ReversePictureType {
    Float = 2,
    FullScreen = 1,
    Normal = 0
}
export enum ReversePictureOrderType {
    Destroy = 1,
    Produce = 0
}
export enum ReversePictureInType {
    FadeIn = 1,
    Hard = 0
}
export enum ReversePictureOutType {
    FadeOut = 1,
    Hard = 0
}
export enum ReversePictureEffectType {
    Shake = 1,
    None = 0
}
export enum ReverseVideoOrderType {
    Destroy = 1,
    Restart = 3,
    Pause = 2,
    Produce = 0
}
export enum ReverseNavigateType {
    ChapterEnd = 4,
    Map = 1,
    ChapterStart = 3,
    HideBtns = 5,
    Episode = 2,
    None = 0
}
export enum ReverseSkipType {
    ChapterEnd = 4,
    InDarkFade = 1,
    OutDarkFade = 2,
    AudioFade = 3,
    None = 0
}
export enum ReverseBorderType {
    FadeOut = 1,
    Keep = 3,
    FadeIn = 2,
    None = 0
}
