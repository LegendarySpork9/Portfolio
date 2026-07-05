import { useState } from "react";
import DropdownMUI from "../../Dropdowns/DropdownMUI/DropdownMUI";
import Badge from '@mui/material/Badge';
import "../../../Colours.css";
import './RightSidebar.css'

interface RightSidebarProps {
  languages: string[];
  setLanguages: (value: string[]) => void;
  frameworks: string[];
  setFrameworks: (value: string[]) => void;
  environments: string[];
  setEnvironments: (value: string[]) => void;
}

function RightSidebar({ languages, setLanguages, frameworks, setFrameworks, environments, setEnvironments }: RightSidebarProps) {
  const [hovered, setHovered] = useState(false);

  return (
    <div className={`sidebar-right ${hovered ? "expanded" : "collapsed"}`} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
      <div className="sidebar-right-content">
        {hovered && (
          <DropdownMUI label="Languages" options={["C#", "Python", "HTML", "CSS", "SQL"]} selected={languages} setSelected={setLanguages} />
        )}
        {!hovered && (
          <Badge
            badgeContent={languages.length} 
            color="error" 
            overlap="rectangular" 
            invisible={languages.length === 0} 
            anchorOrigin={{ vertical: "top", horizontal: "right"}}
            classes={{ badge: "custom-badge"}}
          >
            <img src="/filter.svg" alt="Language" className="sidebar-right-image" />
          </Badge>
        )}
      </div>
      <div className="sidebar-right-content">
        {hovered && (
          <DropdownMUI label="Frameworks" options={[".NET", ".NET Framework", "React", "MSTest", "ASP.NET", "ASPX"]} selected={frameworks} setSelected={setFrameworks} />
        )}
        {!hovered && (
          <Badge
            badgeContent={frameworks.length} 
            color="error" 
            overlap="rectangular" 
            invisible={frameworks.length === 0} 
            anchorOrigin={{ vertical: "top", horizontal: "right"}}
            classes={{ badge: "custom-badge"}}
          >
            <img src="/filter.svg" alt="Language" className="sidebar-right-image" />
          </Badge>
        )}
      </div>
      <div className="sidebar-right-content">
        {hovered && (
          <DropdownMUI label="Environments" options={["Windows", "Website"]} selected={environments} setSelected={setEnvironments} />
        )}
        {!hovered && (
          <Badge
            badgeContent={environments.length} 
            color="error" 
            overlap="rectangular" 
            invisible={environments.length === 0} 
            anchorOrigin={{ vertical: "top", horizontal: "right"}}
            classes={{ badge: "custom-badge"}}
          >
            <img src="/filter.svg" alt="Language" className="sidebar-right-image" />
          </Badge>
        )}
      </div>
    </div>
  );
}

export default RightSidebar;