Read the following documentations, update your memory, make a complete TODO list and start to implement the whole project completely
[
    /home/kali/miradi/Global-Analytics&Situation-Awareness/PART 1 — MASTER TECHNICAL SPECIFICATION.md
    /home/kali/miradi/Global-Analytics&Situation-Awareness/PART 2 — FRONTEND ARCHITECTURE & USER INTERFACE SPECIFICATION
    /home/kali/miradi/Global-Analytics&Situation-Awareness/PART 3 — BACKEND ARCHITECTURE, SOCKET.IO, SEQUELIZE & REAL-TIME PROCESSING
    /home/kali/miradi/Global-Analytics&Situation-Awareness/PART 4 — DATABASE SCHEMA, GEOSPATIAL DESIGN & DATA RELATIONSHIPS
    /home/kali/miradi/Global-Analytics&Situation-Awareness/PART 5 — ANALYTICS ENGINE, MAP INTELLIGENCE & GEO-SPATIAL VISUALIZATION
    /home/kali/miradi/Global-Analytics&Situation-Awareness/PART 6 — UI-UX DESIGN SYSTEM, COMMAND CENTER DASHBOARDS & USER EXPERIENCE
    /home/kali/miradi/Global-Analytics&Situation-Awareness/PART 7 — PRODUCTION ARCHITECTURE, DEPLOYMENT, DEVOPS, SECURITY & SCALABILITY
    /home/kali/miradi/Global-Analytics&Situation-Awareness/PART 8 — DEVELOPMENT ROADMAP, IMPLEMENTATION ORDER & AI CODING ASSISTANT EXECUTION PLAN
]
---------------------------------------------------------------------------------

I tried The database seed succeeded manually, i changed enviromet variables [user was root, no password, and database was runing through xampp] so everything now runs 
You can view the app[http://localhost:5173/] it is open here on integrated browser
I've already run all [mysql database through xampp,backend,seeded data,maptiler-server,and frontend] and the pages are looking stunning

Make sure we also have a panel with forms to perform CRUD operations to all the tables for future use instead of using seed data, this will help us to have realistic data and sometimes as fallback incase we dont have IOT devices that auto capture informations

If you need You can view the app[http://localhost:5173/] it is open here on integrated browser

Continue implementing Remaining Items (Future Iterations)
These are specified in Parts 5–7 but not yet fully implemented:
Three.js 3D overlays (sync with map camera)
Heatmap / route / geofence map layers (backend models exist; frontend toggles are wired)
PDF/Excel export engine (reports UI is ready)
MapTiler Server — install separately; map falls back to OSM tiles if unavailable
CI/CD pipelines and automated tests
Email/SMS notification channels

After this..
- you can go back to analyse all the forgotten/missing implementations and implement them, 
Delivery focus is to ensure..
- not depend on resources from the internet(full offline ecosystem)
- professional,productive world-wide features and functionalities
- cover widescope of proffesion and usability
- implement all possible system security features for preventive easure and firm security
- maintain good usability and adaptive interface
---------------------------------------------------------------------------------------

if you look at the file [frontend/src/maps/MapContainer.jsx] there is commented code and uncommented codes. The commented codes was the initial code and the uncommented codes are the latest, now i want to merge some feature from old codes on displaying online map.
We did a great job offline-first. But let us add the toggle button n settings between [Offline and OpenStreetMap internet fallback]
By default it should be offline but if online is needed it should be switched and ready to use so let us bring back the just the OpenStreetMap internet fallback.. this will help when convenient

Then, continue with deeper items next — full PDF generation, geofence point editor UI, or permission-based field-level access?

What do you suggest are the missing pieces in the current backend/frontend wiring list all of them so we can ut them on TODO list

-----------------------

Lets work on <MapControls /> layerToggles for [Clusters,Heatmap,Routes,Geofences,3D View] and make sure when they are toggled they perform some actions we can populate/add dummy points points for easy workaround 
Lets populate routes & route_points tables for its toggle to work
Lets populate Heatmap data so that its toggle should work

ALSO LETS FIX PAGE-CONTENT, CHARTS AND TABLE TO BE REFLECTIVE AND RESPONSIVE TO DATA(ADD DATA IF THEY ARE OT AVAILABLE TO SIMULATE REALITY)
- Where page content is long then the whole page content section should be scrollabe
1. On dashboard page
- Severity Distribution chart
- Events chart
- Recent Events table should be scrollable
- Active Alerts table should be scrollable

2. evet monitoring page
- Analytics  chart
- Recent Events  chart

3. asset trackig page
- Tracked Assets table should be scrollable

4. cyber security soc page
- Analytics  chart
- Security Events  chart

DO THE SAME IMPROVEMENTS TO THE REST OF PAGES
 - Network Monitoring age
 - Logistics Control age
 - Fraud Detection age
 - IoT Monitoring age
 - Emergency Response age


 ==>On reports page generates all reports in (CSV,EXCEL,PDF) and also should be able to be exported in both formats
 ==>On import page when user select Import type the page should help the user by indicating/displaying structure and format of data/columns just like 'input field placeholders'
 And the import functionality should work as intended, capture data and insert them
 ==>On API docs page it does not display anything regardless of backend running, THe documentation should always be displayed and up to date and should depend solely in this project frontend&backend without the need of any third part service/assistance

 ==>The Offline/online status pill should reflect when user choose Map Mode so if user uses 
 - open street map(mapMode === 'osm') this is online link and 
 - when they use maptiler server(mapMode === 'maptiler') this is local offline maptiler server for vector style and 
 - when they use MBTiles(OFFLINE_STYLE) this is local offline mapptiler server for raster style

---------------------------------------

There is already a button "seed demo data" in data management page i think it works but if not you can improve it to work

I've already seeded data so Continue with UI fixes (make long page sections scrollable and charts/tables show sample data).

Implement the functionality of button 'reset bearing to north' to work just like in maptiler-server map by bending the map to horizontal like projection

Implement functionality 'enable global projection' ->'enable mercator projection' to work as in maptiler-server map to project the map in sphercal 

=========
If you want, I can next:

wire the map mode pill offline/online status,
improve the reports/import pages,
or add the actual DB-side seeding for routes/heatmap data.