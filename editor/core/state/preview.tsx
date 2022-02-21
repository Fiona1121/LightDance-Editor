import { makeVar } from "@apollo/client";
import {
    ControlMapStatus,
    ControlMapType,
    ControlRecordType,
    DancerCoordinates,
    PreviewReactiveState,
    PreviewState,
} from "core/models";
import { cloneDeep } from "lodash";
import onChange from "on-change";

// types
/**
 * Mutable State
 */
const _previewState: PreviewState = {
    isPlaying: false,

    currentTime: 0,
    currentControlIndex: 0,
    currentPosIndex: 0,

    currentStatus: {},
    currentFade: false,
    currentPos: {},

    controlRecord: [],
    controlMap: {},
};

// The diffSet will save changed attributes in state
const diffSet = new Set<string>();
export const previewState = onChange(_previewState, (path: string, value, previousValue, applyData) => {
    diffSet.add(path.split(".")[0]);
});

/**
 * Reactive State, can trigger react component rerender
 */
export const previewReactiveState: PreviewReactiveState = {
    isPlaying: makeVar<boolean>(false),

    currentTime: makeVar<number>(0),
    currentControlIndex: makeVar<number>(0),
    currentPosIndex: makeVar<number>(0),

    currentStatus: makeVar<ControlMapStatus>({}),
    currentPos: makeVar<DancerCoordinates>({}),
    currentFade: makeVar<boolean>(false),

    controlRecord: makeVar<ControlRecordType>([]),
    controlMap: makeVar<ControlMapType>({}),
};

/**
 * copy state to reactiveState, which will trigger rerender in react components.
 * If states array is empty, we will automatically replace the changed states.
 */
export function syncPreviewReactiveState(states: string[]) {
    if (states.length === 0) {
        // only update states in diffSet
        diffSet.forEach((key) => {
            if (key in previewState && key in previewReactiveState) {
                console.debug("update previewReactiveState", key);
                previewReactiveState[key](cloneDeep(previewState[key]));
            } else {
                console.error(`[syncPreviewReactiveState] Cannot find the key ${key}`);
            }
        });
        diffSet.clear();
    } else {
        states.forEach((key) => {
            if (key in previewReactiveState && key in previewState) {
                console.debug("update previewReactiveState", key);
                previewReactiveState[key](cloneDeep(previewState[key]));
            } else {
                console.error(`[syncPreviewReactiveState] Cannot find the key ${key} in state.`);
            }
        });
    }
}
