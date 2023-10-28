import '../../assets/css/main.css'

export default function Main() {

    const handleYesButtonClick = () => {
        console.log('Yes button clicked');
        document.querySelector('.ImageDiv').style.transform = 'translateX(1000%) translateY(-100%) rotate(-180deg)';
        newCard();
    };

    const handleNoButtonClick = () => {
        console.log('No button clicked');
        document.querySelector('.ImageDiv').style.transform = 'translateX(-1000%) translateY(-100%) rotate(180deg)';
        newCard();
    };

    function delay(ms) {
        return new Promise(resolve => {
            setTimeout(resolve, ms);
        });
    }

    async function newCard() {

        document.querySelector('.ProfileDiv').style.height = '0%';
        
        document.querySelector('.LookingForTraits').style.transform = 'scale(0) translateY(-1000%)';
        document.querySelector('.PositiveTraits').style.transform = 'scale(0) translateY(-1000%)';
        document.querySelector('.BioParagraph').style.transform = 'scale(0) translateY(-1000%)';
        document.querySelector('.NameLabel').style.transform = 'scale(0) translateY(-1000%)';

        //TODO: update profile to new one right here

        await delay(500)

        document.querySelector('.ImageDiv').style.transform = 'translateX(0%) translateY(-200%) rotate(0deg)';

        await delay(500);
        
        document.querySelector('.ProfileDiv').style.height = '70%';

        document.querySelector('.LookingForTraits').style.transform = 'scale(1) translateY(0%)';
        document.querySelector('.PositiveTraits').style.transform = 'scale(1) translateY(0%)';
        document.querySelector('.BioParagraph').style.transform = 'scale(1) translateY(0%)';
        document.querySelector('.NameLabel').style.transform = 'scale(1) translateY(0%)';

        document.querySelector('.ImageDiv').style.transform = 'translateX(0%) translateY(0%) rotate(0deg)';

    }

    return (
        <div>
            <link href='https://fonts.googleapis.com/css?family=Comfortaa' rel='stylesheet'></link>
            <div className="MatchDiv">
                <div className="ProfileDiv">
                    <div className="ImageDiv">
                        <img src="../../assets/images/testprofile.png" className="ProfileImage"></img>
                        <div className="ProfileBanner"></div>
                    </div>

                    <b className="NameLabel">Test Person</b>
                    <p className="BioParagraph">Hello! I'm Test Person, Class of 2027. This is my bio, I'm super cool. Be my roommate. aaaaaaaaaaaaaaaaaaaaa</p>
                    <ul className="PositiveTraits">
                        <b>About me</b>
                        <li>Midnight bed time</li>
                        <li>Computer science major</li>
                        <li>Okay with sharing stuff</li>
                    </ul>
                    <ul className="LookingForTraits">
                        <b>My preferences</b>
                        <li>No smoking</li>
                        <li>Wants to be friends</li>
                        <li>Likes to workout</li>
                    </ul>
                </div>
                <br></br>
                <button className="MatchButton" id="YesButton"><img className="ButtonIcon" src="../../assets/images/check.png" onClick={handleYesButtonClick}></img></button>
                <button className="MatchButton" id="NoButton"><img className="ButtonIcon" src="../../assets/images/x.png" onClick={handleNoButtonClick}></img></button>
            </div>
        </div>
    )
}