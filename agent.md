create a prototype with the following features:

- **Tech Stack:** Plain HTML, CSS, and vanilla JavaScript.
- **UI Styling:** Tailwind CSS via CDN (for a convenient, simple, minimal, professional feel).
- **Navigation:** Multi-page layout or tab-based navigation simulating routing between Map, Dashboard aand inventory pages.
- **Map Style:** Satellite or Street view style.

interactive map (maplibre gl js)
Light points on the map, when clicked, show some mock information: Light intensity in % and Temperature. Have a button to refresh measurements. Also it should be possible to instantly change the temperature/light level. This controls should be typed, dont use a slider.

Ability to draw a polygon region that will contain light points. When this zone is clicked, show its ID, number of light points inside (use "X" for now, dont bother computing it) and a button to go to its programming page. Reference: https://maplibre.org/maplibre-gl-js/docs/examples/draw-polygon-with-mapbox-gl-draw/

This programming page is a simple form:
    + Schedule of program (start and end date, both optional)
    + turn on X mintutes after sunset, turn off Y after sunrise
    + Time based configuration: "choose light profile" (will be a list the user chooses from) (A profile defines for each hour its light intensity)

Additionaly, have a dashboard page, with the following widgets: Weather information and inventory information.

Also, add an inventory management page. It should allow the user to view a list of all owned lights and hardware, providing a simple way to manage them. Specifically, it must include a form or modal to add a new light to the inventory, and a way to remove existing lights from the list.

Finally, have a profile creation/removal page. "As a user, I want to access a global list of available dimming profiles, so I can quickly select one without needing additional configuration. Global constant profiles from 10% to 100% must be provided.
As a user, I want to create custom dimming profiles so that I can define specific intensity levels for different times of the day. "

This is a prototype, focus solely on showcasing the vision of this features, they needn't be functional. It must have a simple, minimal, professional feel.
Make sure the main color palette uses standard CSS variables configured in Tailwind, so they can be changed easily. Ensure the map center and mocked light points are positioned around Porto, Portugal.

Dont create a backend, just hardcode all that is possible, this is for a prototype's sake. Furthermore, extract all hardcoded information (such as map points, inventory stats, weather stats, and project title) into a `data.js` file so it can be configured easily without diving into the application logic. Add asterisks to required fields on the forms, making sure to show a prominent "Draw Region" button to start the polygon drawing interaction seamlessly.

