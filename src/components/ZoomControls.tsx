import React from "react";

interface ZoomControlsProps {
  onZoomIn: () => void;
  onZoomOut: () => void;
}

const ZoomControls: React.FC<ZoomControlsProps> = ({ onZoomIn, onZoomOut }) => {
  return (
    <div className="flex items-center fixed bottom-5 right-5 z-10">
      <button
        className="px-3 py-1 mx-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors duration-300"
        onClick={onZoomIn}
      >
        +
      </button>
      <div className="px-3">zoom</div>
      <button
        className="px-3 py-1 mx-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors duration-300"
        onClick={onZoomOut}
      >
        -
      </button>
    </div>
  );
};

export default ZoomControls;
