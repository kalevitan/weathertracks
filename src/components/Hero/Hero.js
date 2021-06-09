import React from "react"
import styles from "./Hero.module.scss"

const Hero = ({ method }) => {
  return (
    <div className={styles['hero']}>
      <div className="container">
        <div className={styles['hero__text']}>
          <h2>Discover playlist recommendations based on your local weather.</h2>
          <button onClick={method}>Find Tracks</button>
        </div>
      </div>
    </div>
  );
};

export default Hero;