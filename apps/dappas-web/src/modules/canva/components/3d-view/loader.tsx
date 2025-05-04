import React from "react";
import "./loader.css";
import { dotPattern } from '@/modules/canva/components/3d-view/dot-style';



const Loader: React.FC = () => {
  return (
    <div className="loader-container" style={dotPattern}>
      <div className="spinner"></div>
    </div>
  );
};

export default Loader;
