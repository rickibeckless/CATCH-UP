import { Link, Routes, Route, useParams } from "react-router-dom";
import React, { useEffect, useState } from 'react';

const LandingPage = () => {
    let [welcomeTextAtTop, setWelcomeTextAtTop] = useState(false);
    let [siteDescriptionAtTop, setSiteDescriptionAtTop] = useState(false);

    useEffect(() => {
        window.addEventListener('scroll', () => {
            setWelcomeTextAtTop(window.scrollY >= 200);
        });
        
    }), [window.scrollY];

    useEffect(() => {
        window.addEventListener('scroll', () => {
            setSiteDescriptionAtTop(window.scrollY >= 50);
        });
    }), [window.scrollY];

    return (
        <section id="home-landing" title="Photo by Samson Katt: https://www.pexels.com/photo/black-female-freelancer-using-laptop-and-drinking-coffee-near-dog-5256140/">
            <div className={"welcome-text-container" + (welcomeTextAtTop ? " top-container" : "")}>
                <div className={"welcome-text" + (welcomeTextAtTop ? " top-text" : "")}>
                    <h2 id="home-text-description">
                        Welcome to 
                        <span id="home-text-description-label"> CATCH-UP! </span> 
                        Anything New? Blog It!
                    </h2>
                    <h1 id="home-text-welcome">CATCH-UP!</h1>
                </div>
                <div className={"welcome-text-site-description" + (siteDescriptionAtTop ? " top-description" : "")}>
                    <p className="welcome-text-site-description-text">
                        What's been going on with your loved ones? What's happening around the world? 
                        Come CATCH-UP! and find out! Dive into a vibrant community where you can share 
                        your stories, engage with others, and strengthen or forge meaningful connections 
                        that transcend distance.
                    </p>
                </div>
            </div>
        </section>
    )
}

export default LandingPage;