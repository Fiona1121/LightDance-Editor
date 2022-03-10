import {
    ControlMapStatus,
    DancerCoordinates,
    EffectPosMapType,
    EffectRecordMapType,
    EffectStatusMapType,
} from "core/models";

class PreviewApp {
    initialized: boolean;

    isPlaying: boolean;
    currentTime: number;
    currentStatus: ControlMapStatus;
    currentPos: DancerCoordinates;

    effectRecordMap: EffectRecordMapType;
    effectStatusMap: EffectStatusMapType;
    effectPosMap: EffectPosMapType;

    previewInterval: number;
    simulator: any;

    constructor(
        effectRecordMap: EffectRecordMapType,
        effectStatusMap: EffectStatusMapType,
        effectPosMap: EffectPosMapType
    ) {
        this.initialized = false;

        this.isPlaying = false;
        this.currentTime = 0;
        this.currentStatus = {};
        this.currentPos = {};

        this.effectRecordMap = effectRecordMap;
        this.effectStatusMap = effectStatusMap;
        this.effectPosMap = effectPosMap;

        this.previewInterval = 0;
    }
}
