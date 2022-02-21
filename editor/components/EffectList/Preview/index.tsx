import React, { useLayoutEffect, useEffect } from "react";
// states and actions
import { useReactiveVar } from "@apollo/client";
import { reactiveState } from "core/state";
// controller instance
import controller from "./Controller";

/**
 * This is Display component
 * @component
 */
const Preview: React.FC<{ effectName: string }> = ({ effectName }) => {
    useLayoutEffect(() => {
        controller.init(effectName);
        const currentStatus = reactiveState.currentStatus();
        const currentPos = reactiveState.currentPos();
        controller.updateDancersStatus(currentStatus);
        controller.updateDancersPos(currentPos);
    }, []);

    const isPlaying = useReactiveVar(reactiveState.isPlaying);
    useEffect(() => {
        if (isPlaying) {
            controller.play();
        } else {
            controller.stop();
        }
    }, [isPlaying]);

    return (
        <div
            style={{
                height: "500px",
                width: "100%",
            }}
        >
            <div
                id="preview"
                style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "100%",
                }}
            >
                <div id="preview_stage" />
            </div>
        </div>
    );
};
export default Preview;
