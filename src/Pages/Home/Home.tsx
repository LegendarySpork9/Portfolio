import Navbar from '../../Components/Navbar/Navbar'
import './Home.css'

function Home() {
  return (
    <div>
      <Navbar />
      <div className="App">
        <header className="App-header">
          <img src="/logo.svg" className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.tsx</code> and save to reload.
          </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
        </header>
      </div>
    </div>
  );
}

export default Home
