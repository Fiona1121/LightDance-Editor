import { controlAgent } from "api";
import { registerActions } from "../registerActions";
// types
import { EffectRecordMapType, EffectRecordType, EffectStatusMapType, State } from "../models";
import { binarySearchFrameMap, getControl, setItem } from "core/utils";

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
        // todo: mutation API
    },

    /**
     * delete chosen effect from EffectRecodeMap and EffectStatusMap
     * @param {State} state
     * @param {string} payload
     */
    deleteEffect: (state: State, payload: string) => {
        // todo: mutation API
    },

    /**
     * apply effect to current frame
     * @param {State} state
     * @param {string} payload
     */
    applyEffect: (state: State, payload: string) => {
        // todo: mutation API
    },
});

export const { setEffectRecordMap, setEffectStatusMap, addEffect, deleteEffect, applyEffect } = actions;
