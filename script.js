const equipment = [
    { id: 'IDE-01', name: 'HINO 500 FUEL TRUCK 10 TON PB 9940 SW' },
    { id: 'IDE-02', name: 'HINO 500 WATER TRUCK 10 TON B9056 WFU' },
    { id: 'IDE-03', name: 'WHEEL LOADER FORKLIFT 5 TON' },
    { id: 'IDE-04', name: 'TADANO MOBILE CRANE' },
    { id: 'IDE-05', name: 'BULLDOZER SEM 816D' },
    { id: 'IDE-06', name: 'BULLDOZER SEM 816D' },
    { id: 'IDE-07', name: 'BULDOZER KOMATSU D85ESS' },
    { id: 'IDE-08', name: 'EXCAVATOR KOBELCO SK200-10' },
    { id: 'IDE-09', name: 'EXCAVATOR KOBELCO SK200-10' },
    { id: 'IDE-10', name: 'EXCAVATOR LONG ARM SK210LC-10' },
    { id: 'IDE-11', name: 'HINO 500 VACUM TRUCK 10 TON' },
    { id: 'IDE-12', name: 'HINO 500 VACUM TRUCK 10 TON' },
    { id: 'IDE-13', name: 'HINO 500 MANLIFT' },
    { id: 'IDE-14', name: 'HINO 300 WELL TEST' }
];

const personnel = {
    'Site Manager': ['NOFRINTO FLORY', 'ONGEN LATUHAMALO', 'ROBBY JUNUS'],
    'Admin': ['ANDRYONI SALAWANE', 'DONI HIDAYAT', 'JAMES TAPADA'],
    'Operator Excavator': ['SRI EDI WIJAYA', 'JAMAL', 'YOHANIS SAGISOLO', 'RUSMAN'],
    'Operator Dozer': ['HERMAN KENIK', 'SUYATNO', 'KARSIMAN', 'PAULUS NGABA'],
    'Operator Crane': ['MARDI', 'YOHANIS BASTIAN', 'ZAINAL ABAS'],
    'Rigger': ['TAUFIK ISWANTO', 'NOSTALGIA KANTOHE', 'MARCHELINO'],
    'Driver Vacuum/Fuel': ['CORNELES BERHTIU', 'IRWAN BUA DAI', 'MUH.KHAERUN ANAM', 'AUDI KAWULUR'],
    'Helper Vacuum/Fuel': ['STEVANO', 'TERRI SINANU', 'RUDENTUS ARESY', 'KELAKAT RUMAGORANG'],
    'Driver Manlift/Welltest/Watertruck': ['RONAL PESULIMA', 'MICHAEL BERHITU', 'MELIANUS ISTIA', 'PETRUS REWUL']
};

let offSiteCrew = new Set();
let ws;

// Initialize WebSocket connection
function initWebSocket() {
    ws = new WebSocket('ws://localhost:8080');
    
    ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.type === 'crewUpdate') {
            offSiteCrew = new Set(data.offSiteCrew);
            displayPersonnel();
            updateCrewCounts();
        }
    };

    ws.onclose = () => {
        // Try to reconnect after 5 seconds
        setTimeout(initWebSocket, 5000);
    };
}

// Load saved crew status from sessionStorage
function loadCrewStatus() {
    const savedStatus = sessionStorage.getItem('crewStatus');
    if (savedStatus) {
        offSiteCrew = new Set(JSON.parse(savedStatus));
    }
}

// Save crew status to sessionStorage
function saveCrewStatus() {
    const crewStatus = Array.from(offSiteCrew);
    sessionStorage.setItem('crewStatus', JSON.stringify(crewStatus));
    
    // Broadcast the update to all connected clients
    if (ws && ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({
            type: 'crewUpdate',
            offSiteCrew: crewStatus
        }));
    }
}

function displayEquipment() {
    const equipmentList = document.getElementById('equipmentList');
    
    // Create header for equipment list
    const header = document.createElement('div');
    header.className = 'equipment-header';
    header.innerHTML = '<h2>Equipment List</h2>';
    header.addEventListener('click', () => {
        equipmentList.classList.toggle('collapsed');
        header.classList.toggle('collapsed');
    });
    equipmentList.appendChild(header);

    // Create container for equipment items
    const itemsContainer = document.createElement('div');
    itemsContainer.className = 'equipment-items';
    
    equipment.forEach(item => {
        const div = document.createElement('div');
        div.className = 'equipment-item';
        div.innerHTML = `<strong>${item.id}</strong>: ${item.name}`;
        itemsContainer.appendChild(div);
    });

    equipmentList.appendChild(itemsContainer);
}

function displayPersonnel() {
    const personnelCategories = document.getElementById('personnelCategories');
    const isLoggedIn = sessionStorage.getItem('isLoggedIn') === 'true';
    
    // Create header for personnel section
    const header = document.createElement('div');
    header.className = 'personnel-header';
    header.innerHTML = '<h2>Personnel Schedule</h2>';
    header.addEventListener('click', () => {
        personnelCategories.classList.toggle('collapsed');
        header.classList.toggle('collapsed');
    });
    personnelCategories.appendChild(header);

    // Create container for personnel items
    const categoriesContainer = document.createElement('div');
    categoriesContainer.className = 'personnel-items';

    Object.entries(personnel).forEach(([category, members]) => {
        const div = document.createElement('div');
        div.className = 'personnel-category';
        div.innerHTML = `
            <h3>${category}</h3>
            <ul class="personnel-list">
                ${members.map(member => `
                    <li>
                        ${member}
                        ${isLoggedIn ? `
                            <button class="toggle-site-status" data-member="${member}">
                                ${offSiteCrew.has(member) ? 'Mark On-site' : 'Mark Off-site'}
                            </button>
                        ` : `
                            <span class="status-indicator ${offSiteCrew.has(member) ? 'off-site' : 'on-site'}">
                                ${offSiteCrew.has(member) ? 'Off-site' : 'On-site'}
                            </span>
                        `}
                    </li>
                `).join('')}
            </ul>
        `;
        categoriesContainer.appendChild(div);
    });

    // Add event listeners for toggle buttons
    categoriesContainer.querySelectorAll('.toggle-site-status').forEach(button => {
        button.addEventListener('click', (e) => {
            const member = e.target.dataset.member;
            if (offSiteCrew.has(member)) {
                offSiteCrew.delete(member);
                e.target.textContent = 'Mark Off-site';
                saveCrewStatus();
            } else {
                offSiteCrew.add(member);
                e.target.textContent = 'Mark On-site';
                saveCrewStatus();
            }
            updateCrewCounts();
        });
    });

    personnelCategories.appendChild(categoriesContainer);
}

function updateCrewCounts() {
    const totalCrew = Object.values(personnel).flat().length;
    const offSiteCount = offSiteCrew.size;
    const onSiteCount = totalCrew - offSiteCount;
    
    document.getElementById('totalCrew').textContent = totalCrew;
    document.getElementById('crewOnSite').textContent = onSiteCount;
    document.getElementById('crewOffSite').textContent = offSiteCount;
}

window.addEventListener('load', () => {
    loadCrewStatus();
    displayEquipment();
    displayPersonnel();
    updateCrewCounts();
    initWebSocket();
});