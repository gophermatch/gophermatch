import React from 'react'
import styles from '../../assets/css/carousel.module.css'

export default function Carousel(props) {
    const [position, setPosition] = React.useState(0)

    function shiftPosition(n) {

    }

    const currentImage = props.pictures[position];
    const carouselLen = props.pictures.length

    let dots = props.pictures.map((pic, i) => {
        if (i == position) { // the key is weird, will need to change if issues
            return <button key={pic + i} className={styles.dotSolid}></button>
        } else {
            return <button key={pic + i} className={styles.dotEmpty} onClick={() => setPosition(i)}></button>
        }
    })

    const dotSection = (
        <div className={styles.dotSection}>
            <button className={styles.progressButton} onClick={() => setPosition((position - 1 + carouselLen) % carouselLen)}>
                &lt;
            </button>
            <div className={styles.dots}>{dots}</div>
            <button className={styles.progressButton} onClick={() => setPosition((position + 1) % carouselLen)}>
                &gt;
            </button>
        </div>
    )

    return (
        <div className={styles.container}>
            <div>
                <img src={currentImage} className={"rounded-2xl"}/>
            </div>
            {carouselLen > 1 && dotSection}
        </div>
    )
}