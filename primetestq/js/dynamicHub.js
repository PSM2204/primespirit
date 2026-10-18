export function initializeOrbitEngine() {
    document.addEventListener('click', (e) => {
        const node = e.target.closest('.orbit-node');
        if (!node) return;

        // Anti-spam protection
        if (node.classList.contains('is-launching')) return;
        node.classList.add('is-launching');
        setTimeout(() => node.classList.remove('is-launching'), 1500);

        let ecosystem = node.dataset.ecosystem;
        
        // Fallback mapping if data-ecosystem is missing
        if (!ecosystem) {
            const text = node.innerText.toLowerCase();
            if (text.includes('jee')) ecosystem = 'jee-main';
            else if (text.includes('neet')) ecosystem = 'neet';
            else if (text.includes('cuet')) ecosystem = 'cuet';
            else if (text.includes('iat')) ecosystem = 'iat';
            else if (text.includes('nest')) ecosystem = 'nest';
            else if (text.includes('class')) {
                const match = text.match(/class\s*(\d+)/);
                ecosystem = match ? `class${match[1]}` : 'class11'; 
            }
        }

        if (!ecosystem) {
            console.error("Could not determine exam stream.");
            return;
        }

        document.getElementById('screen-home-hub').classList.add('hidden');
        document.getElementById('screen-cockpit-simulation').classList.remove('hidden');
        
        const cockpitTitle = document.getElementById('cockpit-title-label');
        if (cockpitTitle) cockpitTitle.innerText = `${ecosystem.toUpperCase().replace('-', ' ')} CBT HUD`;
        
        window.dispatchEvent(new CustomEvent('startSimulation', { detail: { stream: ecosystem } }));
    });
}
