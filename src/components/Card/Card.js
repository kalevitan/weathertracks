import React from "react"
import styles from "./Card.module.scss"

const Card = ({ node }) => {
  return (
    <div className={styles.card} key={node.id}>
      <a className={styles.card__link} href={node.external_urls.spotify} target="_blank" title="Open playlist in Spotify web app." rel="noopener noreferrer">
        <picture className={styles.card__media}>
          <img
            src={node.images[0].url} 
            alt={node.name}
          />
        </picture>
        <div className={styles.card__meta}>
          {node.name}
        </div>
      </a>
    </div>
  );
};

export default Card;