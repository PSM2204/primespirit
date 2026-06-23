export function initializeOrbitEngine() {
    const orbitNodes = document.querySelectorAll('.orbit-node');
    const homeScreen = document.getElementById('screen-home-hub');
    const cockpitScreen = document.getElementById('screen-cockpit-simulation');
    const cockpitTitle = document.getElementById('cockpit-title-label');

    orbitNodes.forEach(node => {
        node.addEventListener('click', (e) => {
            const ecosystem = e.currentTarget.dataset.ecosystem;
            const themeColor = e.currentTarget.style.getPropertyValue('--theme-color');
            
            e.currentTarget.style.transform = 'translate(-50%, -50%) scale(4)';
            e.currentTarget.style.opacity = '0';
            
            setTimeout(() => {
                homeScreen.classList.add('hidden');
                cockpitScreen.classList.remove('hidden');
                
                if (cockpitTitle) {
                    cockpitTitle.innerText = `${ecosystem.toUpperCase()} ASSESSMENT HUD`;
                    cockpitTitle.style.color = themeColor;
                }
                
                window.dispatchEvent(new CustomEvent('startSimulation', { detail: { stream: ecosystem } }));
            }, 400);
        });
    });
}

