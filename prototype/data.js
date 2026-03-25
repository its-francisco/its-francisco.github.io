const MOCK_DATA = {
    projectTitle: "Intelliglow LMS",
    lights: {
        type: 'FeatureCollection',
        features: [
            { type: 'Feature', geometry: { type: 'Point', coordinates: [-8.6291, 41.1579] }, properties: { id: "L001", intensity: 80, temp: 45 } },
            { type: 'Feature', geometry: { type: 'Point', coordinates: [-8.6250, 41.1580] }, properties: { id: "L002", intensity: 100, temp: 50 } },
            { type: 'Feature', geometry: { type: 'Point', coordinates: [-8.6290, 41.1560] }, properties: { id: "L003", intensity: 30, temp: 35 } },
            { type: 'Feature', geometry: { type: 'Point', coordinates: [-8.6300, 41.1590] }, properties: { id: "L004", intensity: 60, temp: 40 } },
            { type: 'Feature', geometry: { type: 'Point', coordinates: [-8.6300, 41.1600] }, properties: { id: "L005", intensity: 60, temp: 40 } },
            { type: 'Feature', geometry: { type: 'Point', coordinates: [-8.6300, 41.1610] }, properties: { id: "L006", intensity: 60, temp: 40 } }
        ]
    },
    weather: {
        temp: "22",
        condition: "Partly Cloudy",
        humidity: "45",
        wind: "12",
        sunset: "19:45",
        sunrise: "06:12"
    },
    inventory: {
        total: "6",
        active: "5",
        maintenance: "1",
        ratioPercentage: "98%"
    },
    profiles: [
        { id: "p100", name: "Constant 100%", desc: "100% intensity all night", type: "global" },
        { id: "p90", name: "Constant 90%", desc: "90% intensity all night", type: "global" },
        { id: "p80", name: "Constant 80%", desc: "80% intensity all night", type: "global" },
        { id: "p70", name: "Constant 70%", desc: "70% intensity all night", type: "global" },
        { id: "p60", name: "Constant 60%", desc: "60% intensity all night", type: "global" },
        { id: "p50", name: "Constant 50%", desc: "50% intensity all night", type: "global" },
        { id: "p40", name: "Constant 40%", desc: "40% intensity all night", type: "global" },
        { id: "p30", name: "Constant 30%", desc: "30% intensity all night", type: "global" },
        { id: "p20", name: "Constant 20%", desc: "20% intensity all night", type: "global" },
        { id: "p10", name: "Constant 10%", desc: "10% intensity all night", type: "global" },
        { id: "p1", name: "Standard Eco", desc: "Dim at midnight", type: "global" },
        { id: "p3", name: "Adaptive Weather", desc: "Rain detector integration", type: "custom" },
        { id: "p4", name: "Custom Late Night", desc: "Gradual dimming from 1AM to 5AM", type: "custom" }
    ],
    mapOptions: {
        center: [-8.6291, 41.1579],
        zoom: 14,
        style: 'https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json',
        lightPointRadius: 4
    },
    uiSettings: {
        drawButtonPosition: { top: "1rem", left: "4.5rem" }, 
        drawPopupPosition: { top: "4rem", left: "4.5rem" }
    }
};