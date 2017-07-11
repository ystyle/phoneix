import React from 'react';
import styles from './Welcome.css';
import img from '../assets/images.png'

function Welcome() {
  return (
    <div className={styles.normal}>
      <h3>Welcome !</h3>
      <img src={img}/>
    </div>
  );
}

export default Welcome;
