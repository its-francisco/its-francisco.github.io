// Tab Navigation
function switchTab(tabId) {
    // Hide all views
    document.querySelectorAll('.view-section').forEach(el => {
        el.classList.add('hidden');
        el.classList.remove('z-10');
    });
    
    // Reset nav buttons
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.remove('bg-primary-50', 'text-primary-700');
        btn.classList.add('text-gray-700');
        btn.querySelector('svg').classList.remove('text-primary-500');
        btn.querySelector('svg').classList.add('text-gray-400');
    });
    
    // Show active view
    const activeView = document.getElementById(`view-${tabId}`);
    if (activeView) {
        activeView.classList.remove('hidden');
        if (tabId === 'map') activeView.classList.add('z-10'); // Map needs specific z-index rules due to absolute positioning
    }
    
    // Highlight active nav
    const activeNav = document.getElementById(`nav-${tabId}`);
    if (activeNav) {
        activeNav.classList.add('bg-primary-50', 'text-primary-700');
        activeNav.classList.remove('text-gray-700');
        activeNav.querySelector('svg').classList.add('text-primary-500');
        activeNav.querySelector('svg').classList.remove('text-gray-400');
    }

    // Trigger map resize if switching to map
    if (tabId === 'map' && window.map) {
        setTimeout(() => window.map.resize(), 100);
    }
}

// Map Initialization
document.addEventListener("DOMContentLoaded", () => {
    // Populate data from MOCK_DATA
    if (typeof MOCK_DATA !== 'undefined') {
        // Project Title
        if (MOCK_DATA.projectTitle) {
            document.title = MOCK_DATA.projectTitle;
            const sidebarTitle = document.getElementById('sidebar-title');
            if (sidebarTitle) sidebarTitle.innerText = MOCK_DATA.projectTitle;
        }

        // Weather
        document.getElementById('weather-temp').innerText = MOCK_DATA.weather.temp + '°C';
        document.getElementById('weather-condition').innerText = MOCK_DATA.weather.condition;
        document.getElementById('weather-humidity').innerText = 'Humidity: ' + MOCK_DATA.weather.humidity + '%';
        document.getElementById('weather-wind').innerText = 'Wind: ' + MOCK_DATA.weather.wind + ' km/h';
        document.getElementById('weather-sun').innerText = 'Sunset: ' + MOCK_DATA.weather.sunset + ' | Sunrise: ' + MOCK_DATA.weather.sunrise;
        
        // Inventory
        document.getElementById('inv-total').innerText = MOCK_DATA.inventory.total;
        document.getElementById('inv-active').innerText = MOCK_DATA.inventory.active;
        document.getElementById('inv-maintenance').innerText = MOCK_DATA.inventory.maintenance;
        document.getElementById('inv-ratio').style.width = MOCK_DATA.inventory.ratioPercentage;

        // Profiles
        const profileSelect = document.getElementById('light-profile-select');
        const profilesList = document.getElementById('profiles-list');

        if (MOCK_DATA.profiles) {
            MOCK_DATA.profiles.forEach(p => {
                // Populate dropdown
                if (profileSelect) {
                    const opt = document.createElement('option');
                    opt.value = p.id;
                    opt.innerText = `${p.name} - ${p.desc}`;
                    profileSelect.appendChild(opt);
                }

                // Populate Profiles Page List
                if (profilesList) {
                    profilesList.innerHTML += `
                        <div class="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex flex-col justify-between">
                            <div>
                                <div class="flex justify-between items-start mb-2">
                                    <h3 class="text-lg font-semibold text-gray-800">${p.name}</h3>
                                    <span class="text-xs px-2 py-1 rounded-full ${p.type === 'global' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}">${p.type.toUpperCase()}</span>
                                </div>
                                <p class="text-sm text-gray-600 mb-4">${p.desc}</p>
                            </div>
                            <div class="flex gap-3 mt-2 border-t pt-3">
                                <button onclick="alert('Editing profile: ${p.name}')" class="text-primary-600 hover:text-primary-800 text-sm font-medium">Edit</button>
                                ${p.type === 'custom' ? `<button onclick="this.parentElement.parentElement.remove(); alert('Profile removed');" class="text-red-500 hover:text-red-700 text-sm font-medium">Remove</button>` : `<span class="text-gray-400 text-sm italic">Read-only</span>`}
                            </div>
                        </div>
                    `;
                }
            });
        }

        // Inventory List Population
        const inventoryList = document.getElementById('inventory-list');
        if (inventoryList && MOCK_DATA.lights && MOCK_DATA.lights.features) {
            MOCK_DATA.lights.features.forEach(light => {
                const props = light.properties;
                const coords = light.geometry.coordinates;
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">${props.id}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Online</span>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Lat: ${coords[1].toFixed(4)}, Lng: ${coords[0].toFixed(4)}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button onclick="if(confirm('Are you sure you want to remove this light from inventory?')) { this.closest('tr').remove(); alert('Light removed'); }" class="text-red-600 hover:text-red-900">Remove</button>
                    </td>
                `;
                inventoryList.appendChild(tr);
            });
        }

        // Apply dynamic UI settings
        if (MOCK_DATA.uiSettings) {
            const drawBtn = document.getElementById('draw-tools-toggle-btn');
            const drawPopup = document.getElementById('draw-tools-overlay');
            
            if (drawBtn && MOCK_DATA.uiSettings.drawButtonPosition) {
                drawBtn.style.top = MOCK_DATA.uiSettings.drawButtonPosition.top;
                drawBtn.style.left = MOCK_DATA.uiSettings.drawButtonPosition.left;
            }
            if (drawPopup && MOCK_DATA.uiSettings.drawPopupPosition) {
                drawPopup.style.top = MOCK_DATA.uiSettings.drawPopupPosition.top;
                drawPopup.style.left = MOCK_DATA.uiSettings.drawPopupPosition.left;
            }
        }
    }

    // Initialize MapLibre
    const map = new maplibregl.Map({
        container: 'map',
        style: typeof MOCK_DATA !== 'undefined' ? MOCK_DATA.mapOptions.style : 'https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json',
        center: typeof MOCK_DATA !== 'undefined' ? MOCK_DATA.mapOptions.center : [-0.1276, 51.5072],
        zoom: typeof MOCK_DATA !== 'undefined' ? MOCK_DATA.mapOptions.zoom : 14
    });

    window.map = map;

    // Add navigation controls
    map.addControl(new maplibregl.NavigationControl(), 'top-left');

    // Add Mapbox GL Draw for polygons (Region Drawing)
    const draw = new MapboxDraw({
        displayControlsDefault: false,
        controls: {
            polygon: true,
            trash: true
        }
    });
    map.addControl(draw, 'top-right');
    window.draw = draw; // Expose to window for the HTML button

    // Mock light points data
    const mockLights = typeof MOCK_DATA !== 'undefined' ? MOCK_DATA.lights : {
        type: 'FeatureCollection',
        features: []
    };

    map.on('load', () => {
        // Add Map Sources
        map.addSource('lights', {
            type: 'geojson',
            data: mockLights
        });

        // Add Light Points Layer
        const pointRadius = (typeof MOCK_DATA !== 'undefined' && MOCK_DATA.mapOptions && MOCK_DATA.mapOptions.lightPointRadius) 
            ? MOCK_DATA.mapOptions.lightPointRadius 
            : 8;

        map.addLayer({
            id: 'light-points',
            type: 'circle',
            source: 'lights',
            paint: {
                'circle-radius': pointRadius,
                'circle-color': '#FBBF24', // Amber/Yellow
                'circle-stroke-width': 2,
                'circle-stroke-color': '#ffffff'
            }
        });

        // Click handler for lights
        map.on('click', 'light-points', (e) => {
            const coords = e.features[0].geometry.coordinates.slice();
            const props = e.features[0].properties;

            // Simple popup HTML
            const popupHtml = `
                <div class="px-2 py-1 min-w-[200px]">
                    <h3 class="font-bold text-gray-800 border-b pb-1 mb-2">Light Node: ${props.id}</h3>
                    
                    <div class="flex justify-between items-center mb-2 mt-2 gap-2">
                        <label class="text-sm text-gray-600 whitespace-nowrap">Intensity %</label>
                        <input type="number" min="0" max="100" value="${props.intensity}" 
                               class="w-16 text-right font-mono text-sm border-gray-300 rounded shadow-sm focus:border-primary-500 focus:ring-primary-500 p-1 border"
                               onchange="console.log('Intensity instantly changed to:', this.value)">
                    </div>
                    
                    <div class="flex justify-between items-center mb-3 gap-2">
                        <label class="text-sm text-gray-600 whitespace-nowrap">Temp °C</label>
                        <input type="number" value="${props.temp}" 
                               class="w-16 text-right font-mono text-sm border-gray-300 rounded shadow-sm focus:border-primary-500 focus:ring-primary-500 p-1 border"
                               onchange="console.log('Temperature instantly changed to:', this.value)">
                    </div>

                    <button class="w-full mt-2 bg-primary-50 text-primary-600 hover:bg-primary-100 text-xs py-1.5 rounded border border-primary-200" onclick="alert('Measurements refreshed!')">
                        Refresh Measurements
                    </button>
                </div>
            `;

            new maplibregl.Popup()
                .setLngLat(coords)
                .setHTML(popupHtml)
                .addTo(map);
        });

        // Change cursor on hover
        map.on('mouseenter', 'light-points', () => { map.getCanvas().style.cursor = 'pointer'; });
        map.on('mouseleave', 'light-points', () => { map.getCanvas().style.cursor = ''; });
    });

    // Handle polygon Selection for Programming
    map.on('draw.selectionchange', (e) => {
        if (e.features && e.features.length > 0) {
            const selectedFeature = e.features[0];
            const areaId = selectedFeature.id || "Region-" + Math.floor(Math.random() * 1000);
            
            // Generate a popup prompt to go to programming page
            const popupHtml = `
                <div class="p-3 text-center min-w-[200px]">
                    <h4 class="font-bold text-gray-800 mb-1 border-b pb-1">Region: ${areaId}</h4>
                    <p class="text-sm text-gray-600 mb-3">Light points inside: X</p>
                    <button onclick="goToProgramming('${areaId}')" class="bg-primary-600 text-white w-full px-3 py-1.5 text-sm rounded shadow hover:bg-primary-700">
                        Program this Region
                    </button>
                </div>
            `;
            
            // Get center of polygon to place the popup roughly 
            // Mocking center by simply taking the first coordinate
            const coord = selectedFeature.geometry.coordinates[0][0];

            new maplibregl.Popup()
                .setLngLat(coord)
                .setHTML(popupHtml)
                .addTo(map);
        }
    });

    // Global function to route to programming with Region ID
    window.goToProgramming = function(regionId) {
        document.getElementById('prog-region-id').innerText = `(${regionId})`;
        
        // Remove popups
        const popups = document.getElementsByClassName('maplibregl-popup');
        if (popups.length) {
            popups[0].remove();
        }

        switchTab('programming');
    };

    // --- ADD LIGHT MAP SELECTION LOGIC ---
    let isSelectingLocation = false;

    window.startMapSelection = function() {
        // Hide Modal
        document.getElementById('add-light-modal').classList.add('hidden');
        // Show map
        switchTab('map');
        // Show selection overlay
        document.getElementById('map-selection-overlay').classList.remove('hidden');
        
        // Change cursor
        map.getCanvas().style.cursor = 'crosshair';
        isSelectingLocation = true;
    };

    window.cancelMapSelection = function() {
        isSelectingLocation = false;
        map.getCanvas().style.cursor = '';
        document.getElementById('map-selection-overlay').classList.add('hidden');
        // Go back to inventory
        switchTab('inventory');
        // Show modal again
        document.getElementById('add-light-modal').classList.remove('hidden');
    };

    map.on('click', (e) => {
        if (!isSelectingLocation) return;
        
        // Set values
        const lng = e.lngLat.lng.toFixed(4);
        const lat = e.lngLat.lat.toFixed(4);
        
        document.getElementById('add-light-lng').value = lng;
        document.getElementById('add-light-lat').value = lat;

        // Cleanup and revert UI
        isSelectingLocation = false;
        map.getCanvas().style.cursor = '';
        document.getElementById('map-selection-overlay').classList.add('hidden');
        
        // Go back to inventory modal
        switchTab('inventory');
        document.getElementById('add-light-modal').classList.remove('hidden');
    });

});
