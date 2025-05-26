import React, { useState } from 'react';
import MinimalPattern from './MinimalPattern';
import PatternControls from './PatternControls';
import './styles.css';

const App = () => {
  const [lineSpacing, setLineSpacing] = useState(20);
  const [rotationSpeed, setRotationSpeed] = useState(0.01);
  const [hue, setHue] = useState(200);

  return (
    <div className="app">
      <MinimalPattern
        lineSpacing={lineSpacing}
        rotationSpeed={rotationSpeed}
        hue={hue}
      />
      <PatternControls
        lineSpacing={lineSpacing}
        setLineSpacing={setLineSpacing}
        rotationSpeed={rotationSpeed}
        setRotationSpeed={setRotationSpeed}
        hue={hue}
        setHue={setHue}
      />
    </div>
  );
};

export default App;
