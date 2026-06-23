import { initializeOrbitEngine } from './dynamicHub.js';
import { initializeTestExecutionEngine } from './cockpitEngine.js';
import { enforceAntiCheatingProtocols } from './antiCheating.js';

window.addEventListener('DOMContentLoaded', () => {
    const spotlight = document.getElementById('spotlight');
    window.addEventListener('mousemove', (e) => {
        spotlight.style.setProperty('--mouse-x', `${(e.clientX / window.innerWidth) * 100}%`);
        spotlight.style.setProperty('--mouse-y', `${(e.clientY / window.innerHeight) * 100}%`);
    });

    initializeOrbitEngine();
    initializeTestExecutionEngine();
    enforceAntiCheatingProtocols();

    const mobilePaletteBtn = document.getElementById('btn-mobile-palette-toggle');
    const asidePalette = document.getElementById('collapsible-aside-palette');
    if (mobilePaletteBtn && asidePalette) {
        mobilePaletteBtn.addEventListener('click', () => asidePalette.classList.toggle('active'));
    }
});
