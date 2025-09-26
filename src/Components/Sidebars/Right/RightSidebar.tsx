import { useState } from "react";
import DropdownMUI from "../../Dropdowns/DropdownMUI/DropdownMUI";
import Badge from '@mui/material/Badge'
import './RightSidebar.css'

function RightSidebar() {
  const [hovered, setHovered] = useState(false);

  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
  const [selectedFrameworks, setSelectedFrameworks] = useState<string[]>([]);
  const [selectedEnvironments, setSelectedEnvironments] = useState<string[]>([]);

  return (
    <div className={`sidebar ${hovered ? "expanded" : "collapsed"}`} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
      <div className="sidebar-content">
        {hovered && (
          <DropdownMUI label="Languages" options={["C#", "Python", "HTML", "CSS", "SQL"]} selected={selectedLanguages} setSelected={setSelectedLanguages} />
        )}
        {!hovered && (
          <Badge
            badgeContent={selectedLanguages.length} 
            color="error" 
            overlap="rectangular" 
            invisible={selectedLanguages.length === 0} 
            anchorOrigin={{ vertical: "top", horizontal: "right"}}
            classes={{ badge: "custom-badge"}}
          >
            <img src="/filter.svg" alt="Language" className="sidebar-image" />
          </Badge>
        )}
      </div>
      <div className="sidebar-content">
        {hovered && (
          <DropdownMUI label="Frameworks" options={[".NET", ".NET Framework", "React", "MSTest", "ASP.NET", "ASPX"]} selected={selectedFrameworks} setSelected={setSelectedFrameworks} />
        )}
        {!hovered && (
          <Badge
            badgeContent={selectedFrameworks.length} 
            color="error" 
            overlap="rectangular" 
            invisible={selectedFrameworks.length === 0} 
            anchorOrigin={{ vertical: "top", horizontal: "right"}}
            classes={{ badge: "custom-badge"}}
          >
            <img src="/filter.svg" alt="Language" className="sidebar-image" />
          </Badge>
        )}
      </div>
      <div className="sidebar-content">
        {hovered && (
          <DropdownMUI label="Environments" options={["Windows", "Website"]} selected={selectedEnvironments} setSelected={setSelectedEnvironments} />
        )}
        {!hovered && (
          <Badge
            badgeContent={selectedEnvironments.length} 
            color="error" 
            overlap="rectangular" 
            invisible={selectedEnvironments.length === 0} 
            anchorOrigin={{ vertical: "top", horizontal: "right"}}
            classes={{ badge: "custom-badge"}}
          >
            <img src="/filter.svg" alt="Language" className="sidebar-image" />
          </Badge>
        )}
      </div>
    </div>
  );
}

export default RightSidebar;