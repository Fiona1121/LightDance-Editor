import { controlAgent } from "api";
import { registerActions } from "../registerActions";
// types
import { EffectRecordMapType, EffectRecordType, EffectStatusMapType, State } from "../models";
import { binarySearchFrameMap, getControl, setItem } from "core/utils";
import { nanoid } from "nanoid";

const actions = registerActions({
    /**
     * set effectRecordMap
     * @param {State} state
     * @param {EffectRecordMapType} action
     */
    setEffectRecordMap: (state: State, payload: EffectRecordMapType) => {
        state.effectRecordMap = payload;
        setItem("effectRecordMap", JSON.stringify(state.effectRecordMap));
    },

    /**
     * set effectStatusMap
     * @param {State} state
     * @param {EffectStatusMapType} payload
     */
    setEffectStatusMap: (state: State, payload: EffectStatusMapType) => {
        state.effectStatusMap = payload;
        setItem("effectStatusMap", JSON.stringify(state.effectStatusMap));
    },

    /**
     * add effect to record map and status map, the effect doesn't contain frame of endIndex
     * @param {State} state
     * @param {effectName: string; startIndex: number; endIndex: number} payload
     */
    addEffect: async (state: State, payload: { effectName: string; startIndex: number; endIndex: number }) => {
        const [controlMap, controlRecord] = await getControl();
        const { effectName, startIndex, endIndex } = payload;
        const newRecord = controlRecord.slice(startIndex, endIndex);

        state.effectRecordMap[effectName] = newRecord;
        newRecord.map((id: string) => {
            state.effectStatusMap[id] = controlMap[id];
        });
        setItem("effectRecordMap", JSON.stringify(state.effectRecordMap));
        setItem("effectStatusMap", JSON.stringify(state.effectStatusMap));
    },

    /**
     * delete chosen effect from EffectRecodeMap and EffectStatusMap
     * @param {State} state
     * @param {string} payload
     */
    deleteEffect: (state: State, payload: string) => {
        const effectName: string = payload;
        const effectFrameId: EffectRecordType = state.effectRecordMap[effectName];
        effectFrameId.map((id) => {
            delete state.effectStatusMap[id];
        });
        delete state.effectRecordMap[effectName];
        setItem("effectRecordMap", JSON.stringify(state.effectRecordMap));
        setItem("effectStatusMap", JSON.stringify(state.effectStatusMap));
    },

    /**
     * apply effect to current frame
     * @param {State} state
     * @param {string} payload
     */
    applyEffect: (state: State, payload: string) => {
        const effectName: string = payload;
        const shiftTime: number = state.currentTime - state.effectStatusMap[state.effectRecordMap[effectName][0]].start;
        state.effectRecordMap[effectName].map(async (id: string) => {
            const [controlMap, controlRecord] = await getControl();
            const newFrame = state.effectStatusMap[id];
            newFrame.start += shiftTime;
            const newFrameIndex = binarySearchFrameMap(controlRecord, controlMap, newFrame.start);
            await controlAgent.addFrame(
                newFrame.status,
                newFrame.start,
                newFrameIndex,
                controlMap[controlRecord[newFrameIndex - 1]].fade
            );
        });
    },
});

export const { setEffectRecordMap, setEffectStatusMap, addEffect, deleteEffect, applyEffect } = actions;
