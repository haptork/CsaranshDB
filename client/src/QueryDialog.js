import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import logo from './images/logo192.png';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import Card from "./components/Card/Card.js";
import CardHeader from "./components/Card/CardHeader.js";
import CardIcon from "./components/Card/CardIcon.js";
import CardBody from "./components/Card/CardBody.js";
import GithubIcon from "@material-ui/icons/GitHub";
import DescIcon from "@material-ui/icons/Description";
import FavIcon from "@material-ui/icons/Favorite";
//import { makeStyles } from '@material-ui/core/styles';
import iaeaLogo from "./images/iaea-logo.png";
import barcLogo from "./images/barc-logo.jpg";
import Grid from "@material-ui/core/Grid";
import GridItem from "./components/Grid/GridItem";
import Tooltip from '@material-ui/core/Tooltip';
import Chip from '@material-ui/core/Chip';
import Avatar from '@material-ui/core/Avatar';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import TextField from '@material-ui/core/TextField';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from 'react-select';
import Slider from '@material-ui/core/Slider';
import { makeStyles } from '@material-ui/core/styles';

const substrates = [
  { value: 'W', label: "W"}, 
  { value: 'Fe', label: "Fe"}, 
  { value: 'Cu', label: "Cu"}, 
  { value: 'Ni', label: "Ni"}, 
  { value: 'Pt', label: "Pt"}, 
  { value: 'Pd', label: "Pd"}, 
];

const structures = [
  { value: 'bcc', label: "bcc"}, 
  { value: 'fcc', label: "fcc"}
];

const authors = [{label: "A8-Fredric GRANBERG", value: "A8-Fredric GRANBERG"}, {label: "A10-Christophe DOMAIN", value: "A10-Christophe DOMAIN"}, {label: "A5-Andrea SAND", value: "A5-Andrea SAND"}, {label: "A9-María CATURLA", value: "A9-María CATURLA"}, {label: "A12-Andrea SAND", value: "A12-Andrea SAND"}, {label: "A6-Wahyu SETYAWAN", value: "A6-Wahyu SETYAWAN"}, {label: "A11-Andrea SAND", value: "A11-Andrea SAND"}, {label: "A15-Huiqiu DENG", value: "A15-Huiqiu DENG"}, {label: "A2-Andrea SAND", value: "A2-Andrea SAND"}, {label: "A7-Fredric GRANBERG", value: "A7-Fredric GRANBERG"}];

const potentials = [
  { value: 'P1', label: "P1"}, 
  { value: 'P2', label: "P2"},
  { value: 'P3', label: "P3"},
  { value: 'P4', label: "P4"},
  { value: 'P5', label: "P5"},
  { value: 'P6', label: "P6"},
  { value: 'P7', label: "P7"},
  { value: 'P8', label: "P8"},
  { value: 'P9', label: "P9"},
  { value: 'P10', label: "P10"},
  { value: 'P11', label: "P11"},
  { value: 'P12', label: "P12"},
  { value: 'P13', label: "P13"},
  { value: 'P14', label: "P14"},
  { value: 'P15', label: "P15"},
  { value: 'P16', label: "P16"},
];

const ess = [
  { value: 1, label: "Yes"}, 
  { value: 0, label: "No"}
];

const energies = [0, 200];

const temperatures = [0, 2050];


function temperaturetext(value) {
  return `${value} K`;
}

function energytext(value) {
  return `${value}keV`;
}

const energyMarks = [
  {
    value: 0,
    label: '0keV',
  },
  {
    value: 200,
    label: '200keV',
  },
];


const temperatureMarks = [
  {
    value: 0,
    label: '0K',
  },
  {
    value: 2050,
    label: '2050K',
  },
];


export default function QueryDialog(props) {
  const open = props.open;
  const handleClose = () => props.setOpen(false);
  const [substrate, setSubstrate] = React.useState([]);
  const [structure, setStructure] = React.useState([]);
  const [author, setAuthor] = React.useState([]);
  const [potential, setPotential] = React.useState([]);
  const [es, setEs] = React.useState([]);
  const [energy, setEnergy] = React.useState(energies);
  const [temperature, setTemperature] = React.useState(temperatures);

  const handleEnergy = (event, newValue) => {
    setEnergy(newValue);
  };

  const handleTemperature = (event, newValue) => {
    setTemperature(newValue);
  };
const useStyles = makeStyles({
  root: {
    width: 300,
  },
});
const classes = useStyles();
  return (
    <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
        <form name="filter" method="GET">
        <DialogTitle id="form-dialog-title">Dataset Selection</DialogTitle>

        <DialogContent>
          <DialogContentText>
            Select Data-set to explore:
          </DialogContentText>
            <FormControl>
              <span style={{display:"inline-block", top:"8px", minWidth:"200px", color:"slategray", position:"relative", marginLeft:"10px"}}>
              <Select
                value={substrate}
                closeOnSelect={false}
                isMulti
                options={substrates}
                onChange={setSubstrate}
                placeholder="Materials"
                name="substrate"
              />
              </span>
            </FormControl>
            <FormControl>
              <span style={{display:"inline-block", top:"8px", minWidth:"170px", color:"slategray", position:"relative", marginLeft:"10px"}}>
              <Select
                value={structure}
                closeMenuOnSelect={false}
                isMulti
                options={structures}
                onChange={setStructure}
                placeholder="Structures"
              />
              </span>
            </FormControl>
            <FormControl>
              <span style={{display:"inline-block", top:"8px", minWidth:"200px", color:"slategray", position:"relative", marginLeft:"10px"}}>
              <Select
                value={potential}
                closeMenuOnSelect={false}
                isMulti
                options={potentials}
                onChange={setStructure}
                placeholder="Potentials"
              />
              </span>
            </FormControl>
            <FormControl>
              <span style={{display:"inline-block", top:"8px", minWidth:"170px", color:"slategray", position:"relative", marginLeft:"10px"}}>
              <Select
                value={es}
                closeMenuOnSelect={false}
                isMulti
                options={ess}
                onChange={setEs}
                placeholder="Elect. Stopping"
              />
              </span>
            </FormControl>
            <FormControl>
              <span style={{display:"inline-block", top:"8px", minWidth:"200px", color:"slategray", position:"relative", marginLeft:"10px"}}>
              <Select
                value={author}
                closeMenuOnSelect={false}
                isMulti
                options={authors}
                onChange={setAuthor}
                placeholder="Author"
              />
              </span>
            </FormControl>
      <Typography id="range-slider" gutterBottom>
        Temperature range
      </Typography>
      <Slider
        value={temperature}
        onChange={handleTemperature}
        valueLabelDisplay="auto"
        aria-labelledby="range-slider"
        getAriaValueText={temperaturetext}
        marks={temperatureMarks}
        min={temperatures[0]}
        max={temperatures[1]}
        step={10}
        name="temperature"
      />
      <Typography id="range-slider" gutterBottom>
        Energy range
      </Typography>
      <Slider
        value={energy}
        onChange={handleEnergy}
        valueLabelDisplay="auto"
        aria-labelledby="range-slider"
        getAriaValueText={energytext}
        marks={energyMarks}
        min={energies[0]}
        max={energies[1]}
        name="energy"
      />
       </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button type="submit" color="primary">
            Update
          </Button>
        </DialogActions>
          </form>
      </Dialog>
  );
}
/*

<input type="submit" value="Submit"/>

          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Email Address"
            type="email"
            fullWidth
          />
*/ 