Csaransh for cascadesDB:


## Anuvikar : Analysis and Validation

The software uses gcc

### Dependencies and Requirements:

- gcc 5.3 or later or equivalent c++14 compiler.
- cmake
- Python 3.x or Python 2.7 or above, can be added with miniconda or conda.

### Building C++:

1. Go to anuvikar directory.
2. Make a new directory `_build`. 
3. Go to this directory and run `cmake ..` and then `cmake --build .`

The executable `anuvikar` can be found in the `_build` directory. You can run the tests from the *anuvikar* directory by running the `anuvikar_test` application that gets built in the `_build` directory, the command would look like `./_build/anuvikar_test`.

### Python dependencies installation:

You will need to install required python packages to run it on your system. For that, 

1. Go to anuvikar directory.
2. run `conda env create -f environment.yml` and `conda activate csaransh` if you are using conda, or you can use `pip install -r requirements.txt`.

## Csaransh web-app

This is a node.js application. The server uses express.js and client is react.js.

Dependencies:

- Node.js 16 or above which can be installed using nvm.
- From the csaransh directory run "npm install" or "yarn".
- From the csaransh/client directory run "npm install" or "yarn".

## Validating and Adding to CsaranshDB web-app

- Go to anuvikar directory.
- Switch to csaransh conda environment if using conda with: `conda activate csaransh`.

### Basic Validation:

#### Running anuvikar_validate_cdb.py

- `python anuvikar_validate_cdb.py $pathToXyzArchiveDir $pathToOutputDir ...pathToXmlMetafiles`.
- The first argument is a path to the directory that has arhived xyz files as downloaded / stored in CascadesDB. The directory can have many archives but only the ones that correspond to the metafiles given in argument three onwards will be analysed.
- The second argument is path to the output directory. Archives will be extracted to this directory. Also, the processed files `cascades.json`, `cascades.db` and `log.txt` will be stored here. Since the output files have same name, please take care that outputs are not overwritten by multiple runs.
- The third argument onwards can be multiple Xml metafiles to process. These can by given as `pathToMetaFileDir/*.xml`.
- This command may take some time, you can ignore the warnings and runtimewarnings on the output console. There can be errors like corrupt archive, unable to unzip etc. 
- Go through log.txt in the output directory. Search for errors and warnings. Files with errors are not analysed. These can be looked upon and discussed with the author before adding to Cdb.

#### Examples

- An example run command: `python anuvikar_validate_cdb /data/W/newEntries/ /data/W/newEntries /data/W/newEntries/*xml`. Here we have archives and xml files in the same directory and we want output files to be written in the same directory.
- Another example run command: `python anuvikar_validate_cdb /data/W/allArchives/ /data/W/newEntries /data/W/newEntries/*xml`. Here we have storing all the old and new archives in the same directory `allArchives`. Directory for new xml files and output files to be written are  the same.

### Adding to Database

- Run `python anuvikar_add_cdb.py $new_output_dir $destination_db_path $existing_database_path:
- First argument: Provide the output directory of the `anuvikar_validate_cdb.py` which has cascades.json and cascades.db files for the cascades that you wish to add to the database.
- Second argument: File path for the output sqlite3 db.
- Third argument: File path for the existing sqlite3 db if exists.
- The destination db path (second argument) is the database file that can be copied to project_dir/src/db/dev.sqlite3.db to view the updated database.
- The command generates another file which is destination_db_path+'_tree.pickle' which needs to be kept with the db file. This will be used by anuvikar_add_cdb.py while further adding more data (when passing this new db as the third argument).

#### Examples and Use Cases

1. Fresh database:

- Run anuvikar_validate_cdb for the archives and corrensponding meta files. Provide the output directory of this command to anuvikar_add_cdb. For example:
  - `python anuvikar_validate_cdb /data/W/newEntries/ /data/W/newEntries /data/W/newEntries/*xml`
  - `python anuvikar_add_cdb /data/W/newEntries/ /data/W/newEntries/toview.db`
  - `cp /data/W/newEntries/toview.db ./src/db/dev.sqlite3.db`
  - Now you can open the webpage (directions given later in this readme) to view your new entries on csaransh-webapp.

2. Adding new data to the earlier processed db:

  - Let us say that you want to add new data to the db we created in the last step.
  - `python anuvikar_validate_cdb /data/W/newerEntries/ /data/W/newerEntries /data/W/newerEntries/*xml`
  - `python anuvikar_add_cdb /data/W/newerEntries/ /data/W/newerEntries/toview.db /data/W/newEntries/toview.db`
  - `cp /data/W/newerEntries/toview.db ./src/db/dev.sqlite3.db`
  - Now you can open the webpage (directions given later in this readme) to view your newer entries along with the new entries added earlier.

### Starting the development server for the web-app
- From csaransh directory run:
  - `PORT=3001 npm run start dev` or `PORT=3001 yarn run start dev`
- From client sub-directory of csaransh directory run:
  - `npm run start` or `yarn start`

### Starting the production server for the web-app
- From client sub-directory of csaransh directory run:
  - `npm run build` or `yarn build`
- From csaransh directory run:
  - `npm run start`
  - This will start the server at port 3000.
  - One can use pm2.js or any other process manager to start the npm server as a daemon whenever system starts.