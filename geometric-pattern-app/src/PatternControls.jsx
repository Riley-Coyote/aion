import React from 'react';

const PatternControls = ({
  lineSpacing,
  setLineSpacing,
  rotationSpeed,
  setRotationSpeed,
  hue,
  setHue,
}) => {
  return (
    <div className="controls">
      <div className="control">
        <label>Line Spacing</label>
        <input
          type="range"
          min="5"
          max="50"
          value={lineSpacing}
          onChange={(e) => setLineSpacing(Number(e.target.value))}
        />
      </div>
      <div className="control">
        <label>Rotation Speed</label>
        <input
          type="range"
          min="0"
          max="0.1"
          step="0.001"
          value={rotationSpeed}
          onChange={(e) => setRotationSpeed(Number(e.target.value))}
        />
      </div>
      <div className="control">
        <label>Line Color Hue</label>
        <input
          type="range"
          min="0"
          max="360"
          value={hue}
          onChange={(e) => setHue(Number(e.target.value))}
        />
      </div>
    </div>
  );
};

export default PatternControls;
