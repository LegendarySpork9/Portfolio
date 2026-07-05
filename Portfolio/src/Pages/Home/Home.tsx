import { useState, useEffect, useRef } from "react";
import { usePortfolio } from "../../Hooks/UsePortfolio";
import Navbar from '../../Components/Navbar/Navbar'
import LeftSidebar from '../../Components/Sidebars/Left/LeftSidebar'
import RightSidebar from '../../Components/Sidebars/Right/RightSidebar'
import Card from '../../Components/Cards/ItemCard/ItemCard'
import AlertSnackbar from "../../Components/Snackbar/AlertSnackbar";
import "../../Colours.css";
import './Home.css'
import { ItemModel } from "../../Types/Item";

function Home() {
  const { data: items, isLoading, error } = usePortfolio();

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

  if (isLoading)
    return (
      <div>Loading...</div>
    );

  if (error)
    return (
      <div>Failed to load portfolio items.</div>
    );

  const allItems = items ?? [];

  let displayItems = allItems;
/*
  if (selectedLanguages.length > 0 || selectedFrameworks.length > 0 || selectedEnvironments.length > 0){
    displayItems = allItems.filter(item => Object.values(item.tags).some(tag => selectedLanguages.includes(tag)) || Object.values(item.tags).some(tag => selectedFrameworks.includes(tag)) || Object.values(item.tags).some(tag => selectedEnvironments.includes(tag)))
  }

  else {
    displayItems = items
  }*/

  return (
    <div className="home-container">
      <div className="grid-container">
        {
          displayItems.map((item: ItemModel) => (
            <Card
              key={item.id}
              image={item.iconURL}
              title={item.name}
              status="Green"
              date={item.dateCreated.toString()}
              id={item.id}
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