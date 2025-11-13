import { useState, useEffect, useRef } from "react";
import Navbar from '../../Components/Navbar/Navbar'
import LeftSidebar from '../../Components/Sidebars/Left/LeftSidebar'
import RightSidebar from '../../Components/Sidebars/Right/RightSidebar'
import Card from '../../Components/Card/Card'
import AlertSnackbar from "../../Components/Snackbar/AlertSnackbar";
import "../../Colours.css";
import './Home.css'

const items = [
  {
    id: 1,
    image: "https://raw.githubusercontent.com/LegendarySpork9/Other-Projects/refs/heads/main/NASA%20Image%20Report/NASA%20Image%20Report/Content/Logo.ico",
    title: "NASA Image Report",
    status: "Green",
    date: "30 September 2025 21:20",
    tags: ["C#", ".NET", "Windows"]
  },
  {
    id: 2,
    image: "https://raw.githubusercontent.com/LegendarySpork9/Other-Projects/refs/heads/main/NASA%20Image%20Report/NASA%20Image%20Report/Content/Logo.ico",
    title: "GitHub to Codecks",
    status: "Yellow",
    date: "30 September 2025 21:20",
    tags: ["C#", ".NET", "Windows"]
  },
  {
    id: 3,
    image: "https://raw.githubusercontent.com/LegendarySpork9/Other-Projects/refs/heads/main/NASA%20Image%20Report/NASA%20Image%20Report/Content/Logo.ico",
    title: "Hunter Industries API",
    status: "Red",
    date: "30 September 2025 21:20",
    tags: ["C#", "CSS", "SQL", ".NET Framework", "ASP.NET", "Website"]
  },
  {
    id: 4,
    image: "https://raw.githubusercontent.com/LegendarySpork9/Other-Projects/refs/heads/main/NASA%20Image%20Report/NASA%20Image%20Report/Content/Logo.ico",
    title: "Server Status",
    status: "Green",
    date: "30 September 2025 21:20",
    tags: ["C#", "HTML", "CSS", ".NET", "MSTest", "Website"]
  },
  {
    id: 5,
    image: "https://raw.githubusercontent.com/LegendarySpork9/Other-Projects/refs/heads/main/NASA%20Image%20Report/NASA%20Image%20Report/Content/Logo.ico",
    title: "Server Backup Tool",
    status: "Yellow",
    date: "30 September 2025 21:20",
    tags: ["C#", ".NET", "MSTest", "Windows"]
  },
  {
    id: 6,
    image: "https://raw.githubusercontent.com/LegendarySpork9/Other-Projects/refs/heads/main/NASA%20Image%20Report/NASA%20Image%20Report/Content/Logo.ico",
    title: "Database BLM Creator",
    status: "Red",
    date: "30 September 2025 21:20",
    tags: ["C#", ".NET", "Windows"]
  },
  {
    id: 7,
    image: "https://raw.githubusercontent.com/LegendarySpork9/Other-Projects/refs/heads/main/NASA%20Image%20Report/NASA%20Image%20Report/Content/Logo.ico",
    title: "RAG V3",
    status: "Red",
    date: "30 September 2025 21:20",
    tags: ["C#", ".NET", "Windows"]
  },
  {
    id: 8,
    image: "https://raw.githubusercontent.com/LegendarySpork9/Other-Projects/refs/heads/main/NASA%20Image%20Report/NASA%20Image%20Report/Content/Logo.ico",
    title: "Google Drive Sync",
    status: "Red",
    date: "30 September 2025 21:20",
    tags: ["C#", ".NET Framework", "MSTest", "Windows"]
  }
]

function Home() {
  const [openLogin, setOpenLogin] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [openAlert, setOpenAlert] = useState(false);
  const [event, setEvent] = useState("");

  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
  const [selectedFrameworks, setSelectedFrameworks] = useState<string[]>([]);
  const [selectedEnvironments, setSelectedEnvironments] = useState<string[]>([]);

  const prevIsAdmin = useRef(isAdmin);

  useEffect(() => {
    if (prevIsAdmin.current === isAdmin) return;

    if (isAdmin) {
      setEvent("Login");
      setOpenAlert(true);
    }
    
    else {
      setEvent("Logout");
      setOpenAlert(true);
    }

    prevIsAdmin.current = isAdmin;
  }, [isAdmin]);

  var displayItems: {
    id: number;
    image: string;
    title: string;
    status: string;
    date: string;
    tags: string[];
  }[];

  if (selectedLanguages.length > 0 || selectedFrameworks.length > 0 || selectedEnvironments.length > 0){
    displayItems = items.filter(item => Object.values(item.tags).some(tag => selectedLanguages.includes(tag)) || Object.values(item.tags).some(tag => selectedFrameworks.includes(tag)) || Object.values(item.tags).some(tag => selectedEnvironments.includes(tag)))
  }

  else {
    displayItems = items
  }

  return (
    <div className="home-container">
      <div className="grid-container">
        {
          displayItems.map((item) => (
            <Card
              key={item.id}
              image={item.image}
              title={item.title}
              status={item.status}
              date={item.date}
            />
          ))
        }
      </div>

      {isAdmin && (
        <LeftSidebar
          setAdmin={setIsAdmin}
        />
      )}
      
      <RightSidebar 
        languages={selectedLanguages} 
        setLanguages={setSelectedLanguages} 
        frameworks={selectedFrameworks} 
        setFrameworks={setSelectedFrameworks} 
        environments={selectedEnvironments} 
        setEnvironments={setSelectedEnvironments}
      />

      <Navbar open={openLogin} setOpen={setOpenLogin} setAdmin={setIsAdmin} />

      <AlertSnackbar open={openAlert} setOpen={setOpenAlert} event={event}/>
    </div>
  );
}

export default Home;