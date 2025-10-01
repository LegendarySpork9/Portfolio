import Navbar from '../../Components/Navbar/Navbar'
import RightSidebar from '../../Components/Sidebars/Right/RightSidebar'
import Card from '../../Components/Card/Card'
import "../../Colours.css";
import './Home.css'

const items = [
  {
    id: 1,
    image: "https://raw.githubusercontent.com/LegendarySpork9/Other-Projects/refs/heads/main/NASA%20Image%20Report/NASA%20Image%20Report/Content/Logo.ico",
    title: "NASA Image Report",
    status: "Green",
    date: "30 September 2025 21:20"
  },
  {
    id: 2,
    image: "https://raw.githubusercontent.com/LegendarySpork9/Other-Projects/refs/heads/main/NASA%20Image%20Report/NASA%20Image%20Report/Content/Logo.ico",
    title: "GitHub to Codecks",
    status: "Yellow",
    date: "30 September 2025 21:20"
  },
  {
    id: 3,
    image: "https://raw.githubusercontent.com/LegendarySpork9/Other-Projects/refs/heads/main/NASA%20Image%20Report/NASA%20Image%20Report/Content/Logo.ico",
    title: "Hunter Industries API",
    status: "Red",
    date: "30 September 2025 21:20"
  },
  {
    id: 4,
    image: "https://raw.githubusercontent.com/LegendarySpork9/Other-Projects/refs/heads/main/NASA%20Image%20Report/NASA%20Image%20Report/Content/Logo.ico",
    title: "Server Status",
    status: "Green",
    date: "30 September 2025 21:20"
  },
  {
    id: 5,
    image: "https://raw.githubusercontent.com/LegendarySpork9/Other-Projects/refs/heads/main/NASA%20Image%20Report/NASA%20Image%20Report/Content/Logo.ico",
    title: "Server Backup Tool",
    status: "Yellow",
    date: "30 September 2025 21:20"
  },
  {
    id: 6,
    image: "https://raw.githubusercontent.com/LegendarySpork9/Other-Projects/refs/heads/main/NASA%20Image%20Report/NASA%20Image%20Report/Content/Logo.ico",
    title: "Database BLM Creator",
    status: "Red",
    date: "30 September 2025 21:20"
  },
  {
    id: 7,
    image: "https://raw.githubusercontent.com/LegendarySpork9/Other-Projects/refs/heads/main/NASA%20Image%20Report/NASA%20Image%20Report/Content/Logo.ico",
    title: "RAG V3",
    status: "Red",
    date: "30 September 2025 21:20"
  },
  {
    id: 8,
    image: "https://raw.githubusercontent.com/LegendarySpork9/Other-Projects/refs/heads/main/NASA%20Image%20Report/NASA%20Image%20Report/Content/Logo.ico",
    title: "Google Drive Sync",
    status: "Red",
    date: "30 September 2025 21:20"
  }
]

function Home() {
  return (
    <div className="home-container">
      <Navbar />

      <div className="grid-container">
        {items.map((item) => (
          <Card
            key={item.id}
            image={item.image}
            title={item.title}
            status={item.status}
            date={item.date}
          />
        ))}
      </div>
      
      <RightSidebar />
    </div>
  );
}

export default Home;