import React from "react";
import BannerImage from "../assets/workflow-homepage.jpg";
import "../styles/Home.css";

function Home() {
  return (
    <div className="mainHome">
      <div className="overlay"></div>
      <div className="home" style={{ backgroundImage: `url(${BannerImage})` }}>
        <div className="headerContainer">
          <h1> Streamline Your Success, </h1>
          <h1> One Task at a Time.</h1>
        </div>
      </div>

      <div className="infoContainer">
        <div className="column1">
          <h2> Who We Are </h2>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce porttitor sapien non justo hendrerit posuere. Vivamus quam tortor, lobortis a leo pulvinar, tincidunt mollis urna. Aliquam quis metus quis turpis feugiat pulvinar. Nullam a libero eu sem suscipit varius a nec augue. Sed blandit metus ac libero scelerisque scelerisque. Pellentesque vehicula tempor diam id posuere. Integer at turpis vel mauris vestibulum sollicitudin nec eu libero. Vestibulum dictum elementum ex suscipit pellentesque. Vivamus imperdiet lacus eget sodales pretium.</p>
        </div>

        <div className="column2">
          <h2> Need Rescue? </h2>
          <p> Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce porttitor sapien non justo hendrerit posuere. Vivamus quam tortor, lobortis a leo pulvinar, tincidunt mollis urna. Aliquam quis metus quis turpis feugiat pulvinar. Nullam a libero eu sem suscipit varius a nec augue. Sed blandit metus ac libero scelerisque scelerisque. Pellentesque vehicula tempor diam id posuere. Integer at turpis vel mauris vestibulum sollicitudin nec eu libero. Vestibulum dictum elementum ex suscipit pellentesque. Vivamus imperdiet lacus eget sodales pretium.</p>
        </div>
      </div>
    </div>
  );
}

export default Home;


