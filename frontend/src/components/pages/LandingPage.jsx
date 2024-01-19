import React, { useState } from 'react';

export default function LandingPage() {
    const [sections, updateSections] = useState([
        { id: 1, title: 'Welcome', content: 'Welcome to our landing page!' },
        { id: 2, title: 'Features', content: 'Explore our amazing features.' },
        { id: 3, title: 'Contact', content: 'Get in touch with us.' }
    ]);

    function goToNextSection() {
        updateSections(q => {
            const copy = deepClone(q);
            copy.shift();
            return copy;
        });
    }

    return (
        <div>
            <header>
                <h1>{sections[0].title}</h1>
                <p>{sections[0].content}</p>
            </header>
            <button onClick={goToNextSection}>Next Section</button>
        </div>
    );
}
