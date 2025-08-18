import { useState } from "react";
import './RightSidebar.css'
import DropdownMUI from "../../Dropdowns/DropdownMUI/DropdownMUI";

function RightSidebar() {
  const [hovered, setHovered] = useState(false);

  return (
    <div className={`sidebar ${hovered ? "expanded" : "collapsed"}`} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
      <div className="sidebar-content">
        {hovered && (
          <DropdownMUI label="Languages" options={["C#", "Python", "HTML", "CSS", "SQL"]} />
        )}
        {!hovered && (
          <img src="/filter.svg" alt="Language" className="sidebar-image" />
        )}
      </div>
      <div className="sidebar-content">
        {hovered && (
          <DropdownMUI label="Frameworks" options={[".NET", ".NET Framework", "React", "MSTest", "ASP.NET", "ASPX"]} />
        )}
        {!hovered && (
          <img src="/filter.svg" alt="Language" className="sidebar-image" />
        )}
      </div>
    </div>
  );
}

export default RightSidebar