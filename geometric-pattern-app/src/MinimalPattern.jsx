import React from 'react';

const containerStyle = {
  width: '100vw',
  height: '100vh',
  margin: 0,
  backgroundImage: `repeating-linear-gradient(45deg, #444 0, #444 10px, #222 10px, #222 20px)`,
};

export default function MinimalPattern() {
  return <div style={containerStyle} />;
}
