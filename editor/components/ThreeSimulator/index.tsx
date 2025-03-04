import { useEffect, useRef, useLayoutEffect } from "react";

// states and actions
import { reactiveState } from "core/state";
import { setCurrentPosToGround } from "core/actions";
import { useReactiveVar } from "@apollo/client";

// hotkeys
import { useHotkeys } from "react-hotkeys-hook";

import { useResizeDetector } from "react-resize-detector";

import { threeController } from "./ThreeController";

import SelectionModeSelector from "components/SelectionModeSelector";

// constants
import { IDLE, POSITION } from "constants";

/**
 * This is Display component
 *
 * @component
 */
export default function ThreeSimulator() {
  const canvasRef = useRef();
  const { ref: containerRef } = useResizeDetector({
    onResize: (width, height) => {
      if (threeController && threeController.isInitialized())
        threeController.resize(width, height);
    },
  });

  const isPlaying = useReactiveVar(reactiveState.isPlaying);
  const editMode = useReactiveVar(reactiveState.editMode);
  const selectionMode = useReactiveVar(reactiveState.selectionMode);

  const selected = useReactiveVar(reactiveState.selected);

  useLayoutEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    threeController.init(canvas, container);
  }, []);

  useEffect(() => {
    if (threeController && threeController.isInitialized()) {
      threeController.updateSelected(selected);
    }
  }, [selected]);

  useEffect(() => {
    if (threeController && threeController.isInitialized()) {
      threeController.controls.deactivate();
      if (editMode !== IDLE) {
        threeController.controls.activate(selectionMode);
      }
    }
  }, [editMode, selectionMode]);

  useEffect(() => {
    threeController.setIsPlaying(isPlaying);
  }, [isPlaying]);

  useHotkeys("g", () => {
    if (
      reactiveState.editMode() !== IDLE &&
      reactiveState.selectionMode() === POSITION
    ) {
      setCurrentPosToGround();
    }
  });

  return (
    <div
      style={{
        height: "100%",
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
      ref={containerRef}
    >
      <div ref={canvasRef} />
      <SelectionModeSelector />
    </div>
  );
}
