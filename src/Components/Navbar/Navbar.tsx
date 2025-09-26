import './Navbar.css';

function Navbar() {
  return (
    <nav className="navbar" >
      <a href="https://github.com/LegendarySpork9" style={{paddingLeft: "2rem"}}>
        <img src="/github.svg" alt="Github" />
      </a>
      <div>
        Toby Hunter's Portfolio
      </div>
      <a href="/Account" style={{paddingRight: "2rem"}}>
        <img src="/account.png" alt="Account" />
      </a>
    </nav>
  );
};

export default Navbar;