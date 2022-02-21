import { registerActions } from "../registerActions";

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
});
