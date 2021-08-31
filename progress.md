Main Branches to work:

- Optimization.
- Database.
- Gui.
- FCC.
- Alloy.

10th Aug:

WIP:

- 11pm-1pm: O: ~~plotly custom build.~~
  - https://github.com/plotly/plotly.js/blob/master/CUSTOM_BUNDLE.md
  - npm run custom-bundle -- --out csaransh --transforms none --traces scatter,bar,box,scatter3d,mesh3d,histogram2dcontour,heatmap

- 1pm - 3pm: D: ~~Selection of DB. .~~
  - sqlite seems okay for the following reasons.
    - db size is less than a GB.
    - Most of the query fields can be saved as values in the database.
    - coordinates can be stored as text or JSON.
    - JSON1 plugin supports json format.
    - Need latest version of sqlite.
    - Installing latest version on older ubuntu is difficult. Compiling for source might be a hassle as it is failing on my system too. Wasted an hour on this.

- 3pm - D: Installed knex and created basic database configurations.

TODO:

- Create migrations for cascades table.
- Create api to fetch records one page at a time.
- Create api to fetch all details of a specific record.

---

11th Aug:

WIP:

- Added migrations and seeding of dev data for the table.
  - Sought help from https://blog.bitsrc.io/seeding-your-database-with-thousands-of-users-using-knex-js-and-faker-js-6009a2e5ffbf
  - commands to remember:
    - ./node_modules/knex/bin/cli.js migrate:down --env development
    - ./node_modules/knex/bin/cli.js migrate:latest --env development
    - ./node_modules/knex/bin/cli.js seed:run --env development

TODO:

- ~~Create migrations for cascades table.~~
- Create api to fetch records one page at a time.
- Create api to fetch all details of a specific record.


13th Aug:

WIP:

- ~~Api for inserting a new record.~~
  - TODO: Testing later.
- ~~Api for fetching all records.~~
- ~~Api for fetching all details of a specific record.~~

TODO:

- Fetch records with pagination and filtering.
- ~~Create api to fetch all details of a specific record.~~
- ~~Change the structure of the app such that client code with react is on a sub-directory ./client.~~
- ~~Install nodemon etc. on the server.~~

14th Aug:

WIP:

- ~~restructured app with client react app as a sub directory. Found pointers at: ~~
  - https://daveceddia.com/create-react-app-express-backend/#commento-login-box-container
  - https://github.com/joshterrill/simple-express-server
  - ~~Installed nodemon etc. as a result.~~
  - ~~ pagination and sorting api. ~~

TODO:

  - Filtering api.

15th Aug:

WIP:

- ~~Filters in all cascade api.~~
  - curl -X GET 'http://localhost:3001/cascades?filter[id]=1&filter[ndefects][]=5&filter[ndefects][]=8'
  - curl -X GET 'http://localhost:3001/cascades?limit=2&offset=2&sort=ndefects&filter[id]=1'

- QRC for knex: https://devhints.io/knex

---------------

With this We're done with basic functional DB and its API.

---------------

TODO:

- React table with ajax that uses the API exposed.

16th Aug:

WIP:

- React table with ajax that uses the API exposed.
  - New react table version (7) uses hooks introduced in react 17.
  - ~~Built a minimal react table 7.~~
  - ~~Read about hooks.~~
  - The conclusion is that hooks are not worth the time. I'll continue with react table 6.
- Imported material dashboard in the project.
  - Weird issues when importing from node-modules so copied to src directory and changed a few import addresses to relative addressing.

TODO:
- ~~Import the Maintable from previous project cleanly.~~

17th Aug:

WIP:
- ~~Imported the Maintable from previous project cleanly.~~
  - Used the url query string to load the initial data that is passed to the table after the
initial load the further filtering, sorting etc. is to be handled on client side.

TODO:
- Add header and table css.
- Optimize the possible duplication of data.
- Add more columns to server side such as density regions etc.
- Add some cascade plots.
- Experiment with table always open etc.
- Implement statistics on client side / on server side by passing the filter string somehow.
- Experiment with new cascade plots. Plotly save as svg.

18th Aug:

WIP:

- Removed warnings and errors on loading the webpage due to react updates.

19th Aug:

WIP:

- Added css for table.

TODO:

- fix: logo moving on table open/close.
- fix: filter fields are not updating in table.
- multi-Select size.
- fetching row data on click for table.
- Adding outline summary data on server side.

27th Aug:

WIP:

- fix: logo moving on table open/close.
    -found the reason. will do later once the logo is finalised.
- ~~fix: filter fields are not updating in table.~~

28th Aug:

WIP:

- ~~fetching row data on click for table.~~
- think about colors of the main page and logo.
  - Flag colors: #ff9933, #138808, #000080, #ef9b50

29th Aug:

WIP:

- Adding cascade visualizations.
  - Adding dependencies from Cascade3DViewer for now fscreen, three...
  - three seems to have changed its interface completely and there are
  vulnerabilities in earlier version. The way forward seems to be to use
  three fiber library and rewrite the vizualization.
  
30th Aug:

WIP:

- ~~Added custom plotly.js.~~
- ~~Tested heatmap.~~

TODO:

- Finalize the cascade view.
- Move to outline and summary.

31st Augh:

WIP:

- Added outline cards to correct for top margin.
- Added infile styles from earlier dashboard to asssets/dashboardstyles.js for correct css of accordian title and subtitle.

TODO:

- ~~Add eigen-coords, dclustcoords to rowInfo for plotting heatmap and meshcascade.~~
  - ~~Change coords to eigen-coords in heatmap.~~
  - ! Add hulls for drawing mesh-cascades.
- Add cluster comparison info to rowdata for cluster comparison plots.
  - Will have to add cluster comparison in a different way for adding to DB in pp.
- Add legend picture for orientation in defect plots such as comparison etc.
- Add outline summary of data.
- Add a plotly scatter plot with different glyph for each defect morphology, size representing.
- Add a plotly scatter plot with different glyph for each defect morphology, hull-meshes for bigger defects and size representing.