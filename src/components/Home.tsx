import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="wrapper">
      <h1>Go ahead, design your poster!</h1>
      <p>Drag the items in the order you like.</p>
      <p>On text items, use double click to make the text editable.</p>
      <Link to="/poster">Do it! &gt;&gt;</Link>
    </div>
  );
}

export default Home;
