import styles from '../../assets/css/settings.module.css'
import SliderButton from '../ui-components/SliderButton.jsx'
import React, { useState, useEffect } from 'react';

export default function Settings() {
    const [currentPage, setPage] = useState(<SettingsPage1/>);

    const buttonClick1 = () => {
        setPage(<SettingsPage1/>);
    }

    const buttonClick2 = () => {
        setPage(<SettingsPage2/>);
    }

    const buttonClick3 = () => {
        setPage(<SettingsPage3/>);
    }


    return (
        <div class={styles.settingsCenter}>
            <h1>Settings</h1>
            <div id={styles.settingsCategories}>
                <button id={styles.categoryButton} onClick={buttonClick1}>Category 1</button>
                <button id={styles.categoryButton} onClick={buttonClick2}>Category 2</button>
                <button id={styles.categoryButton} onClick={buttonClick3}>Category 3</button>
            </div>
            <div>
                {currentPage}
            </div>
        </div>
    );
}

//Function that returns an invidual setting, the text value will be the name of the setting
function Setting(props)
{
    return (
        <label class={styles.settingWithButton}>
                <p1 id={styles.setting}>{props.text}</p1>
                <SliderButton/>
        </label>
    )
}

function SettingsPage1()
{
    let p1settings = 
    [
        {
            "setting" : "1ExampleSetting"
        },
        {
            "setting" : "1ExampleSetting"
        },
        {
            "setting" : "1ExampleSetting"
        },
        {
            "setting" : "1ExampleSetting"
        },
        {
            "setting" : "1ExampleSetting"
        },
    ]

    return (

        <div id={styles.settingsItems}>
            {p1settings.map((b)=>
            {
                return (<Setting text={b.setting}/>); 
            })}
        </div>
    )
}

function SettingsPage2()
{
    let p2settings = 
    [
        {
            "setting" : "2ExampleSetting"
        },
        {
            "setting" : "2ExampleSetting"
        },
        {
            "setting" : "2ExampleSetting"
        },
        {
            "setting" : "2ExampleSetting"
        },
        {
            "setting" : "2ExampleSetting"
        },
    ]

    return (

        <div id={styles.settingsItems}>
            {p2settings.map((b)=>
            {
                return (<Setting text={b.setting}/>); 
            })}
        </div>
    )
}

function SettingsPage3()
{
    let p3settings = 
    [
        {
            "setting" : "3ExampleSetting"
        },
        {
            "setting" : "3ExampleSetting"
        },
        {
            "setting" : "3ExampleSetting"
        },
        {
            "setting" : "3ExampleSetting"
        },
        {
            "setting" : "3ExampleSetting"
        },
    ]

    return (

        <div id={styles.settingsItems}>
            {p3settings.map((b)=>
            {
                return (<Setting text={b.setting}/>); 
            })}
        </div>
    )
}