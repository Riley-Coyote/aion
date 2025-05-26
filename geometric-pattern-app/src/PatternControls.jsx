import React from 'react';

export default function PatternControls({ lineSpacing, setLineSpacing, rotationSpeed, setRotationSpeed, hue, setHue }) {
  return (
    <div className="pattern-controls" style={{ position: 'absolute', top: 10, left: 10, color: '#fff' }}>
      <div>
        <label>
          Line Spacing: {lineSpacing}
          <input
            type="range"
            min="5"
            max="100"
            value={lineSpacing}
            onChange={e => setLineSpacing(Number(e.target.value))}
          />
        </label>
      </div>
      <div>
        <label>
          Rotation Speed: {rotationSpeed.toFixed(2)}
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={rotationSpeed}
            onChange={e => setRotationSpeed(Number(e.target.value))}
          />
        </label>
      </div>
      <div>
        <label>
          Hue: {hue}
          <input
            type="range"
            min="0"
            max="360"
            value={hue}
            onChange={e => setHue(Number(e.target.value))}
          />
        </label>
      </div>
    </div>
  );
}
