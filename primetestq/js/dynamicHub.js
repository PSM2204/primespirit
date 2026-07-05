export function initializeOrbitEngine() {
    const orbitNodes = document.querySelectorAll('.orbit-node');
    const homeScreen = document.getElementById('screen-home-hub');
    const cockpitScreen = document.getElementById('screen-cockpit-simulation');
    const cockpitTitle = document.getElementById('cockpit-title-label');
    orbitNodes.forEach(node => {
        node.addEventListener('click', (e) => {
            let ecosystem = e.currentTarget.dataset.ecosystem;
            if (!ecosystem) {
                const fullText = e.currentTarget.innerText || "";
                ecosystem = fullText.trim().split(' ')[0].toLowerCase().replace(/[^a-z]/g, '');
            }
            
            homeScreen.classList.add('hidden');
            cockpitScreen.classList.remove('hidden');
            
            if (cockpitTitle) {
                cockpitTitle.innerText = `${ecosystem.toUpperCase()} CBT HUD`;
            }
            
            window.dispatchEvent(new CustomEvent('startSimulation', { detail: { stream: ecosystem } }));
        });
    });
}
