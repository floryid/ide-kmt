// Store the current site manager's status
let currentSiteManager = {
    name: sessionStorage.getItem('currentSiteManager') || 'Nofrinto Flory',
    status: 'on-site'
};

// Initialize site manager functionality
function initSiteManager() {
    const siteManagerSelect = document.getElementById('siteManagerSelect');
    if (siteManagerSelect) {
        // Set initial value from session storage or default
        siteManagerSelect.value = currentSiteManager.name;
        
        // Update site manager status when personnel status changes
        updateSiteManagerStatus();
    }
}

// Update site manager when selection changes
function updateSiteManager(selectedManager) {
    currentSiteManager.name = selectedManager;
    sessionStorage.setItem('currentSiteManager', selectedManager);
    
    // Update the status based on personnel schedule
    updateSiteManagerStatus();
}

// Update site manager status based on personnel schedule
function updateSiteManagerStatus() {
    const isOffSite = offSiteCrew.has(currentSiteManager.name);
    currentSiteManager.status = isOffSite ? 'off-site' : 'on-site';
    
    // Update visual indicator in the header
    const siteManagerSelect = document.getElementById('siteManagerSelect');
    if (siteManagerSelect) {
        siteManagerSelect.className = `site-manager-select ${currentSiteManager.status}`;
    }
    
    // If current manager is off-site, find and switch to an on-site manager
    if (isOffSite) {
        const siteManagers = personnel['Site Manager'];
        const onSiteManager = siteManagers.find(manager => !offSiteCrew.has(manager));
        
        if (onSiteManager) {
            currentSiteManager.name = onSiteManager;
            currentSiteManager.status = 'on-site';
            
            // Update the select element
            if (siteManagerSelect) {
                siteManagerSelect.value = onSiteManager;
                siteManagerSelect.className = 'site-manager-select on-site';
            }
            
            // Save to session storage
            sessionStorage.setItem('currentSiteManager', onSiteManager);
        }
    }
    
    // Dispatch event to notify other components
    document.dispatchEvent(new CustomEvent('siteManagerStatusChanged', {
        detail: { manager: currentSiteManager }
    }));
}

// Listen for personnel status changes
document.addEventListener('personnelStatusChanged', (event) => {
    if (event.detail.role === 'Site Manager') {
        updateSiteManagerStatus();
    }
});

// Add event listener for WebSocket updates
function initSiteManagerWebSocket() {
    if (ws) {
        const originalOnMessage = ws.onmessage;
        ws.onmessage = (event) => {
            originalOnMessage(event);
            const data = JSON.parse(event.data);
            if (data.type === 'crewUpdate') {
                updateSiteManagerStatus();
            }
        };
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initSiteManager();
    initSiteManagerWebSocket();
});

// Add event listener for WebSocket updates
function initSiteManagerWebSocket() {
    if (ws) {
        const originalOnMessage = ws.onmessage;
        ws.onmessage = (event) => {
            originalOnMessage(event);
            const data = JSON.parse(event.data);
            if (data.type === 'crewUpdate') {
                updateSiteManagerStatus();
            }
        };
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initSiteManager();
    initSiteManagerWebSocket();
});