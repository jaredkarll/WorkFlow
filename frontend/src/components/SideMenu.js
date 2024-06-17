// SideMenu.js
import React from 'react';
import '../styles/SideMenu.css';

const SideMenu = () => {
  return (
    <div className="side-menu">
      
      <nav>
        <ul>
          <li className="active"><a href="#announcements">Announcements</a></li>
          <li><a href="#tasks">Tasks</a></li>
          <li><a href="#resources">Groups</a></li>
          <li><a href="#emails">Emails</a></li>
          <li><a href="#onboarding">Onboarding</a></li>
          <li><a href="#offboarding">Offboarding</a></li>
        </ul>
      </nav>
    </div>
  );
};

export default SideMenu;
