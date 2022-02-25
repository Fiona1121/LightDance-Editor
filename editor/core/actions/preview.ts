import { State } from "core/models";
import { clamp, fadeStatus, interpolationPos, updateFrameByTimeMap } from "core/utils";
import { registerActions } from "../registerActions";

const actions = registerActions({
    /**
     * calculate the currentPreviewStatus, currentPreviewPos according to the time
     * @param {State} state
     * @param {number} payload
     */
    setCurrentPreviewTime: async (state: State, payload: number) => {
        const controlRecord = state.effectRecordMap[state.currentPreviewEffect].controlRecord;
        const posRecord = state.effectRecordMap[state.currentPreviewEffect].posRecord;

        let time = payload;
        if (isNaN(time)) {
            throw new Error(`[Error] setCurrentPreviewTime invalid parameter(time ${time})`);
        }
        time = Math.max(time, 0);
        state.currentPreviewTime = time;

        // set currentPreviewControlIndex
        const newControlIndex = updateFrameByTimeMap(
            controlRecord,
            state.effectStatusMap,
            state.currentPreviewControlIndex,
            time
        );
        state.currentPreviewControlIndex = newControlIndex;
        if (newControlIndex === controlRecord.length - 1) {
            // Can't fade
            state.currentPreviewStatus = state.effectStatusMap[controlRecord[newControlIndex]].status;
        } else {
            // do fade
            state.currentPreviewStatus = fadeStatus(
                time,
                state.effectStatusMap[controlRecord[newControlIndex]],
                state.effectStatusMap[controlRecord[newControlIndex + 1]]
            );
        }

        // set currentPreviewPosIndex
        const newPosIndex = updateFrameByTimeMap(posRecord, state.effectPosMap, state.currentPreviewPosIndex, time);
        state.currentPreviewPosIndex = newPosIndex;
        if (newPosIndex === posRecord.length - 1) {
            // can't interpolation
            state.currentPreviewPos = state.effectPosMap[posRecord[newPosIndex]].pos;
        } else {
            // do interpolation
            state.currentPreviewPos = interpolationPos(
                time,
                state.effectPosMap[posRecord[newPosIndex]],
                state.effectPosMap[posRecord[newPosIndex + 1]]
            );
        }
        state.currentPreviewFade = state.effectStatusMap[controlRecord[newControlIndex]].fade;
    },

    /**
     * set currentPreviewControlIndex by controlIndex, also set currentPreviewStatus
     * @param {State} state
     * @param {number} payload
     */
    setCurrentPreviewControlIndex: async (state: State, payload: number) => {
        const controlRecord = state.effectRecordMap[state.currentPreviewEffect].controlRecord;
        const posRecord = state.effectRecordMap[state.currentPreviewEffect].posRecord;

        let controlIndex = payload;
        if (isNaN(controlIndex)) {
            throw new Error(`[Error] setCurrentPreviewControlIndex invalid parameter(controlIndex ${controlIndex})`);
        }
        controlIndex = clamp(controlIndex, 0, controlRecord.length - 1);
        state.currentPreviewControlIndex = controlIndex;
        state.currentPreviewTime = state.effectStatusMap[controlRecord[controlIndex]].start;
        state.currentPreviewStatus = state.effectStatusMap[controlRecord[controlIndex]].status;
        // set posIndex and currentPreviewPos as well (by time)
        const newPosIndex = updateFrameByTimeMap(
            posRecord,
            state.effectPosMap,
            state.currentPreviewPosIndex,
            state.effectStatusMap[controlRecord[controlIndex]].start
        );
        state.currentPreviewPosIndex = newPosIndex;
        state.currentPreviewPos = state.effectPosMap[posRecord[newPosIndex]].pos;
        state.currentPreviewFade = state.effectStatusMap[controlRecord[controlIndex]].fade;
    },

    /**
     * set currentPreviewPosIndex by posIndex, also set currentPreviewPos
     * @param {State} state
     * @param {number} payload
     */
    setCurrentPreviewPosIndex: async (state: State, payload: number) => {
        const controlRecord = state.effectRecordMap[state.currentPreviewEffect].controlRecord;
        const posRecord = state.effectRecordMap[state.currentPreviewEffect].posRecord;

        let posIndex = payload;
        if (isNaN(posIndex)) {
            throw new Error(`[Error] setCurrentPreviewPosIndex invalid parameter(posIndex ${posIndex})`);
        }
        posIndex = clamp(posIndex, 0, posRecord.length - 1);
        state.currentPreviewPosIndex = posIndex;
        state.currentPreviewTime = state.effectPosMap[posRecord[posIndex]].start;
        state.currentPreviewPos = state.effectPosMap[posRecord[posIndex]].pos;
        // set controlIndex and currentPreviewStatus as well (by time)
        const newControlIndex = updateFrameByTimeMap(
            controlRecord,
            state.effectStatusMap,
            state.currentPreviewControlIndex,
            state.effectPosMap[posRecord[posIndex]].start
        );
        state.currentPreviewControlIndex = newControlIndex;
        state.currentPreviewStatus = state.effectStatusMap[controlRecord[newControlIndex]].status;
        state.currentPreviewFade = state.effectStatusMap[controlRecord[newControlIndex]].fade;
    },
});

export const { setCurrentPreviewTime, setCurrentPreviewControlIndex, setCurrentPreviewPosIndex } = actions;
