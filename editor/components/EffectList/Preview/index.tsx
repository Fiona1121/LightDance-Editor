import { useRef } from "react";
import { useResizeDetector } from "react-resize-detector";

const Preview = () => {
    const canvasRef = useRef();
    const { ref: containerRef } = useResizeDetector({
        onResize: (width, height) => {
            if (threeController && threeController.isInitialized()) threeController.resize(width, height);
        },
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
        </div>
    );
};

export default Preview;
