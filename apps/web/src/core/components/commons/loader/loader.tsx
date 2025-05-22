import React from 'react';
import './loader.css';
import { dotPattern } from '../patterns/dot-pattern';

const Loader: React.FC = () => {
  return (
    <div className="loader-container" style={dotPattern}>
      <div className="spinner"></div>
    </div>
  );
};

export default Loader;
