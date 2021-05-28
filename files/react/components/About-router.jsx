import React from 'react';
import { Link } from 'react-router-dom';
import './About.scss';
function About() {
  return (
    <div className="about">
      <div className="title">Hello world!</div>
      <Link to="/">Back</Link>
    </div>
  );
}

export default About;
