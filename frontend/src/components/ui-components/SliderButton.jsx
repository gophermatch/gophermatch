import buttonStyles from '../../assets/css/sliderbutton.module.css'

function SliderButton()
{
    return (
         <label class={buttonStyles.switch}>
            <input type="checkbox"></input>
            <span class={buttonStyles.slider}></span>
        </label>
    )
}

export default SliderButton;