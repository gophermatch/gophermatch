import { useRef } from 'react';
import styles from '../../assets/css/match.module.css'

export default function Match() {
    const ref = useRef(null)

    const handleYesButtonClick = () => {
        console.log('Yes button clicked');
        document.querySelector(`.${styles.ImageDiv}`).style.transform = 'translateX(1000%) translateY(-100%) rotate(-180deg)';
        newCard();
    };

    const handleNoButtonClick = () => {
        console.log('No button clicked');
        document.querySelector(`.${styles.ImageDiv}`).style.transform = 'translateX(-1000%) translateY(-100%) rotate(180deg)';
        newCard();
    };

    function delay(ms) {
        return new Promise(resolve => {
            setTimeout(resolve, ms);
        });
    }

    async function newCard() {
        console.log("ref")
        console.log(ref)

        document.querySelector(`.${styles.ProfileDiv}`).style.height = '0%';
        
        document.querySelector(`.${styles.LookingForTraits}`).style.transform = 'scale(0) translateY(-1000%)';
        document.querySelector(`.${styles.PositiveTraits}`).style.transform = 'scale(0) translateY(-1000%)';
        document.querySelector(`.${styles.BioParagraph}`).style.transform = 'scale(0) translateY(-1000%)';
        document.querySelector(`.${styles.NameLabel}`).style.transform = 'scale(0) translateY(-1000%)';

        //TODO: update profile to new one right here

        await delay(500)

        document.querySelector(`.${styles.ImageDiv}`).style.transform = 'translateX(0%) translateY(-200%) rotate(0deg)';

        await delay(500);
        
        document.querySelector(`.${styles.ProfileDiv}`).style.height = '70%';

        document.querySelector(`.${styles.LookingForTraits}`).style.transform = 'scale(1) translateY(0%)';
        document.querySelector(`.${styles.PositiveTraits}`).style.transform = 'scale(1) translateY(0%)';
        document.querySelector(`.${styles.BioParagraph}`).style.transform = 'scale(1) translateY(0%)';
        document.querySelector(`.${styles.NameLabel}`).style.transform = 'scale(1) translateY(0%)';

        document.querySelector(`.${styles.ImageDiv}`).style.transform = 'translateX(0%) translateY(0%) rotate(0deg)';

    }

    return (
        <div id={styles.MatchPage}>
            <link href='https://fonts.googleapis.com/css?family=Comfortaa' rel='stylesheet'></link>
            <div ref={ref} className={styles.MatchDiv}>
                <div className={styles.ProfileDiv}>
                    <div className={styles.TopHalf}>
                        <div className={styles.ImageDiv}>
                            <img src="../../assets/images/testprofile.png" className={styles.ProfileImage}></img>
                            <div className={styles.ProfileBanner}></div>
                        </div>
                        <div className={styles.BioWrapper}>
                            <b className={styles.NameLabel}>Test Person</b>
                            <p className={styles.BioParagraph}>Hello! I'm Test Person, Class of 2027. This is my bio, I'm super cool. Be my roommate. aaaaaaaaaaaaaaaaaaaaa</p>
                        </div>
                    </div>
                    <div className={styles.BottomHalf}>
                        <ul className={styles.PositiveTraits}>
                            <b>About me</b>
                            <li>Midnight bed time</li>
                            <li>Computer science major</li>
                            <li>Okay with sharing stuff</li>
                        </ul>
                        <ul className={styles.LookingForTraits}>
                            <b>My preferences</b>
                            <li>No smoking</li>
                            <li>Wants to be friends</li>
                            <li>Likes to workout</li>
                        </ul>
                    </div>
                </div>
                <br></br>
                <div className={styles.ButtonWrapper}>
                    <button className={styles.MatchButton} id={styles.YesButton}><img className={styles.ButtonIcon} src="../../assets/images/check.png" onClick={handleYesButtonClick}></img></button>
                    <button className={styles.MatchButton} id={styles.NoButton}><img className={styles.ButtonIcon} src="../../assets/images/x.png" onClick={handleNoButtonClick}></img></button>
                </div>
                
            </div>
        </div>
    )
}