import { useState } from "react";
import './RightSidebar.css'

function RightSidebar() {
  const [hovered, setHovered] = useState(false);

  return (
    <div className={`sidebar ${hovered ? "expanded" : "collapsed"}`} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
      <div className="sidebar-content">
        <img src="/dropdown.svg" alt="Language" className="sidebar-image" />
        <span className="sidebar-text">Language</span>
      </div>
    </div>
  );
}

export default RightSidebar