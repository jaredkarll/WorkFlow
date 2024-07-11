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
          <h2> Project Description </h2>
          <p>
            Our proposed app aims to transform the management of app development projects by offering an all-encompassing solution for checklist management, task tracking, and progress monitoring. Utilizing advanced, state-of-the-art technology and based on user-focused design principles, this app will provide an intuitive and highly adaptable platform customized to meet the specific needs of app development teams.
          </p>
          <p>
            From the initiation of a project to its successful completion, our app will optimize workflows, removing the inefficiencies that commonly hinder development processes. It will promote seamless collaboration among team members, ensuring alignment and collective progress towards shared objectives. The app will enhance transparency by delivering real-time updates and serving as a centralized communication hub, ensuring everyone remains informed and engaged.
          </p>
        </div>

        <div className="column2">
          <h2> About Us </h2>
          <p>
            <strong>Why We Did This Project:</strong> The development of the WorkFlow app stemmed from our collective experiences and frustrations with the traditional methods of managing app development projects. We recognized the challenges faced by teams, including inefficiencies in task tracking, lack of real-time updates, and difficulties in collaboration. Our goal was to create a solution that addresses these issues head-on, providing a seamless and intuitive platform that enhances productivity and fosters collaboration.
          </p>
          <p>
            <strong>Purpose:</strong> The primary purpose of the WorkFlow app is to streamline the management of app development projects. By integrating advanced features such as dynamic progress monitoring, user permissions, and feedback collection, we aim to optimize workflows and enhance transparency. Our app is designed to be highly adaptable, catering to the unique needs of different development teams and ensuring that every member remains informed and aligned with project goals.
          </p>
          <p>
            We believe that the WorkFlow app will revolutionize the way app development projects are managed, ultimately leading to more successful and efficient project completions. By providing a centralized platform for task management and communication, we are committed to empowering development teams to achieve their full potential and deliver high-quality results.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Home;
