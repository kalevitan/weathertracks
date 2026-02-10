import React from "react"
import { Link } from "gatsby"
import styles from "./Hero.module.scss"

const Hero = ({ method, hasResults }) => {
  return (
    <div className={styles.hero}>
      <div className="container">
        <div className={styles.hero__header}>
          <h1 className={styles.logo}>WeatherTracks</h1>
          <Link to="/about" className={styles.hero__about}>About</Link>
        </div>
        <div className={styles.hero__text}>
          <p>Discover Spotify playlist recommendations based on<br /> your local weather.</p>
          { !hasResults && (
            <div className={styles.hero__actions}>
              <button onClick={method}>Find Tracks</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Hero;
