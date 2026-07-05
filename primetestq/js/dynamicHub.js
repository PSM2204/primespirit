export function initializeOrbitEngine() {
    // Event delegation on the document ensures clicks are caught even if elements are hidden initially
    document.addEventListener('click', (e) => {
        const node = e.target.closest('.orbit-node');
        if (!node) return; // Ignore clicks that aren't on an orbit node

        let ecosystem = node.dataset.ecosystem;
        if (!ecosystem) {
            const fullText = node.innerText || "";
            ecosystem = fullText.trim().split(' ')[0].toLowerCase().replace(/[^a-z]/g, '');
        }
        
        document.getElementById('screen-home-hub').classList.add('hidden');
        document.getElementById('screen-cockpit-simulation').classList.remove('hidden');
        
        const cockpitTitle = document.getElementById('cockpit-title-label');
        if (cockpitTitle) cockpitTitle.innerText = `${ecosystem.toUpperCase()} CBT HUD`;
        
        window.dispatchEvent(new CustomEvent('startSimulation', { detail: { stream: ecosystem } }));
    });
}
