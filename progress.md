Main Branches to work:

- Optimization.
- Database.
- Gui.
- FCC.
- Alloy.
- Surface.

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
  - More commands:
    - knex migrate:make initUsers --env development
    - knex seed:make addUsers --env development


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

## 2nd Sep:

WIP:
- Created clusters table, seeds and get api for it.

## 3rd Sep:

WIP:

- Fixed some issues with clusters table.
  - To remove ambiguity, cascades table primary id now starts from zero and it is same as cascade-id (which can now be removed from table (column)).

TODO:
- Show cluster comparison plots.
- Show statistics plots.
- Show table with downloadable info.
- Add 3d defect morphology plot.
- Same min-max for contour plots.
Optimizing json size:
  - I can use gzip for sending json data initially.
  - Smaller field names. Possibly with attributes.

## 5th Sep:

WIP:
- ~~Enable cluster comparison view.~~

TODO:
- ~~Add error for field not found in shortname.~~
- Improve handling of 404 error in clustercmp.
- Improve handling of 404 error in cascadeinfo.
- round of dists in cmp, cmpsize on save in json etc.

## 6th Sep:

WIP:
- ~~Fixed minor issues with cluster comparison.~~
- Show statistics plots.

TODO:
- Clean and refactor cluster comparison code.
- Show statistics plots.
- Show table with downloadable info.
- Add 3d defect morphology plot.
- Same min-max for contour plots.
Optimizing json size:
  - I can use gzip for sending json data initially.
  - Smaller field names. Possibly with attributes.

## 5th Sep:

WIP:
- ~~Enable cluster comparison view.~~

TODO:
- ~~Add error for field not found in shortname.~~
- Improve handling of 404 error in clustercmp.
- Improve handling of 404 error in cascadeinfo.
- round of dists in cmp, cmpsize on save in json etc.

## 6th Sep:

WIP:
- ~~Fixed minor issues with cluster comparison.~~
- ~~Show statistics plots.~~
- ~~Added hdbpoint coordinates to each cluster in clusters.db for clusters plots.~~

TODO:
- Add cluster hdbscan coords to clusters db.
- Clusters and cluster stats panel.
- Add 3d defect morphology plot.
- Better error handling, cleaning of cluster comparison code.
- Add manual update button on statistics, auto update switch can also be given.
- Add more columns to statistics.
- Add dclustersv / subcascades to table and statistics.
- rename json entries in pp.
- Add table view.
- Initially Loading overlay on webpage.
- On click loading overlay.
- Plotly plots control bar: svg save, no plotly ad. etc.
- pp:
  - defect morphology, type and desc. such as burgers vector separately.
  - Think of some way to create entries in clustercmp.
  - store kdd and hdbscan training.
  - change keys.

## 7th Sep:

WIP:
- ~~Cluster Classes plot.~~

TODO:

- Cluster class stats.

## 10th Sep:

WIP: 

- ~~Cluster class trends api.~~
- ~~Cluster class trends plots.~~
- ~~Added second plot.~~

TODO:

- Remove vacancy clusters from sia morphology stats plot 1.
- Move common functions from the two stats plots together and 
  possibly add them to server side.
- ~~Add outline API.~~
- Add table view with download option.
- knew.raw warning remove.
- csaransh-pp: 
  - validate and process from cascadesDB.
    - improved log summary for review.
    - figure out how to add, save kd-tree etc.
    - add status to table (unreviewed, reviewed) for statistical testing.

## 11th Sep:

WIP:

- python script to start processing and outputting log, log-summary, json, sqlite db.
  - ~~created client code and scaffolding.~~

TODO:

- Current deployment strategy:
  - After file upload.
    - Three possibilities to initiate csaransh validation depending on current implementation of CascadesDB.
      - Manual: concerned moderator / admin runs cmd or api request to start processing from python / c++.
      - Start processing using api automatically after file upload.
      - AWS lambda (not being explored for now).
  - The function outputs log, json and sqlite db, possibly sends mail for
    the review.
  - After review, (possibly kdd cluster comparison again and) add new rows to the main db.

TODO:

- Alternative deployment using aws lambda:
  - Create a python aws lambda for upload of cascade event.
  - Save log, add to a db, with a web preview and send mail.
  - Process an s3 file from aws ec2.

## 12th Sep:

WIP:

- ~~Added pp code to create sqliteDb.~~
- Good quick reference for python sqlite:
  - https://www.sqlitetutorial.net/sqlite-python/ 

TODO:

- Test db created by pp on web-app.
- Add log for python.
- log-summary.
- merge verified file to main db.
  - cluster-comparison kdd, change ids etc.
  - save umap pre-trained.

## 13th Sep:

WIP:

- ~~Test db created by pp on web-app.~~

TODO:

- fix potential name.
- fix outline messages when temperature/ energy is single, e.g. "From 15keV to 15keV"
- fix wrong row count on excluding a single row from the statistics using the second action button.
- Validate multiple archives.
- muli kd-tree implementation for cluster pattern recognitioin of new clusters with existing data.

## 14th Sep:

WIP:

- ~~Testing adding new database with comparison.~~
- ~~Added dimensionality reduction updates to new data entries~~
- ~~change inputs of validate to src-dir, dest-dir, meta-files (can be multiple)~~

TODO:

- change input of merge to ...
- dclust_coords missing in db viewfields.
- umap correct params.

## 15th Sep:

WIP:

- ~~set up initial server on aws.~~
  - pm2 is a nice tool to run server: https://hackernoon.com/deploying-a-node-app-on-amazon-ec2-d2fb9a6757eb 

## 16th Sep:

WIP:

- ~~Deployment build and serve html with express.~~
- Fix classification hdb points.
- Fix outline texts, short / long.
- python cdb-validate-multiple.py cascadesdb/W/ cascadesdb/W/ 0 1 cascadesdb/W/*xml

## 17th Sep:

WIP:

- ~~Adding Fcc processing. ~~
- ~~Unit testcases for Fcc processing. ~~

TODO:

- Testing fcc on CascadesDb data.

## 20th Sep:

WIP:

- ~~Tested Fcc on CascadedDb data.~~
- Begin with ebgl visualizations.

## 21st Sep:

WIP:

- Improving defect morphology information.
  - Components:
    - Add direction info for each atom.
    - Add component morphologies and their attributes separately.
    - add components and indices for each atom for bounding-box etc.
    - !Form a name by combining them.
    - !di-interstitial as three atoms sharing a site.
    - !distinction between tripod and hexagon/rings.

- Adding morphology visualizations.
  - atoms have color from direction/type-atom-1,atom-2, vac or morphology of component type.
  - Add point defects as is. (MeshInstance)
    - On mouse over show size, sia/vac, morphology and properties etc.
  - Add small components (size four or less) with 2d blobs representing their morphology and direction. Color may also represent the direction of burgers vector or majority dumbbells or linear combination of all dumbbells in the component. Bounding box of bigger clusters may have more opacity value.
    - On mouse over highlight the defect, show size, sia/vac, morphology and properties, with %ge of each component  in the defect etc.
  - Add big components with buffergeometry.
    - On mouse over highlight the defect, show size, sia/vac, morphology and properties, with %ge of each component  in the defect etc.
  - Add lines for each dumbbell pair, either all white or color representing orientation.
  - Different type of atoms (in an alloy) can have different glyphs.

TODO:

- Replace subcascade mesh visualization with convex hull / bounding-box from webgl.
- Add svg save to threejs and plotly plots.

- lineFeat have points and orient for each line, this data can be used for m-viz.
- box center , origin and dimensions in database (viewfields) for rendering of coordinates.

## 23rd Sep:

WIP:

- Working on getting buffer geometry in react-three-fiber with opacity value.
  - TODO: create a issue and pull request on react-three-fiber for:
    1. Static rendering of points.
    2. Opacity value for points.

## 24th Sep:

WIP:

- Add line direction for single dumbbells and other sia non-clusters in viewfields.
- 



## 24th Sep:

WIP:

- Adding dislocation components to viz with bounding box.
- Adding ring components to viz with bounding sphere. Later separate tetrahedron, hexagon and sphere.
- Adding # components to viz with bounding distorted mesh.
- Adding vacancy clusters with bounding cylinder of color mustard/yellow?
- Adding lines to components.
- Adding lines to sia point defects.
- click and highlight information and change of opacity.
- simulation wireframe box and camera setting.
- axis helper.
- buttons for configuration: if needed.

TODO:

- Work for alloys.
- buttons for show/hide meshes, camera perspective/orthographic.

## 25th Sep:

WIP:

- Add dislocation component sias and vacancies as one buffer-geometry.

## 26th Sep:

WIP:

- 

TODO:
- Adding vacancy clusters with bounding cylinder of color mustard/yellow?
- simulation wireframe box and camera setting.
- Sia atoms colors according to orientation.
- click and highlight information for components.
  - %ge composition etc.
- simulation wireframe box and camera setting.
- axis helper.
- buttons for configuration: if needed.
- buttons for configuration: if needed.


## 27th Sep:

WIP:

- Add -1 as a special case for dumbbells or crowdions.
- An array for dumbbells and orientations.
- box dimensions and minimum value in the json.
- add %ge contribution in number of defect and other information for components.

- using the above add simulation wireframe, camera settings, axis helper, on click info.
- check if it is easy to add lines.

TODO:

- Add points from 'subline' of main line if not already adding those.
- Call makeLatticeGroups only once for each cascade. Currently it is being called for each clusterId.

## 28th Sep:

WIP:

- An array for dumbbells and orientations.
- box dimensions and minimum value in the json.

- add %ge contribution in number of defect and other information for components.

TODO:

- Add information for morph. visualization to the DB.
- using the above add simulation wireframe, camera settings, axis helper, on click info.

## 29th Sep:

WIP:

- ~~Add information for morph. visualization to the DB.~~
- ~~Add morph. visualization to csaransh.~~
- ~~Correct Camera position.~~

TODO:

- For cluster from current cascade, no fetch call is needed savi-venu can do the job.

## 30th Sep:

WIP:

- ~~Add wireframe box.~~
- ~~Add axis helper.~~
- Add info on mouse-hover.
- Cluster comparison on click .
- Finalize Viz.

## 1st Oct:

WIP:

- ~~ignore more thresh.~~
- ~~File-name in log error and warning.~~
- ~~add to cdb script interface.~~

## 2nd Oct:

WIP:

- Readme documentation.
- Finalizing script interfaces.


## 4rd Oct:

WIP:

- Fix class names in savi.

## 5th Oct:

WIP:

- Updated environment.yml for conda with updated python packages and made changes as per new library interfaces.
- Fixed runtime warning for division by zero when creating subline.
- Added structure parameter to db.

TODO:

- Test validate script for Fe and Cu.
- Correct on click for vacancy in savimorph.
- Add structure to csaransh columns.

## 6th Oct

WIP:

- ~~Correct on click for vacancy in savimorph viz.~~
- ~~On click for meshes in savimorph viz.~~
- ~~Testing of Fe and W data.~~
  - TODO: Check why 7? are not showing. Don't show 0 size anyway.
- ~~Add log for python.~~

TODO:

- ~~Add logging flags for c++.~~
- !!Legend for orientations, mesh shapes etc.
- !!fix wrong row count on excluding a single row from the statistics using the second action button.
- !!Testing on Cu data and all the cascadesDb data.
----- Deploy at IAEA server
- !Another script for giving input from cmd line.
- !Add svg save to threejs and plotly plots.
- !fix: logo moving on table open/close.
- !Table for cascade info with download links.
- !Corrent input file and xyzfilepath.
- Add partial support for imperfect initial crystals.
- buttons for configuration: if needed.
- Landing page with filters.
- About page.
- Same min-max in contour plot.

## 7th Oct

WIP:

- ~~Add logging flags for c++.~~
- Legend for orientations, mesh shapes etc.
- ~~Add more columns to maintable.~~
- Deploy to Aws.

TODO:

- fix wrong row count on excluding a single row from the statistics using the second action button.
- Add mesh for 7? and no component defect clusters.
- Change icon for temperature in outline.
- links to cascadesdb in infile and xyzfile.