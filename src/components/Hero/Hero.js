import React from "react"
import styles from "./Hero.module.scss"

const Hero = ({method}) => {
  return (
    <div className={styles['hero']}>
      <div className="container">
        <h1>Mood Music</h1>
        <div className={styles['hero__text']}>
          <p>Discover playlist recommendations based on your local weather.</p>
          <button onClick={method}>Find Tracks</button>
        </div>
      </div>
    </div>
  );
};

export default Hero;