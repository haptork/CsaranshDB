import React from 'react';

import Grid from "@material-ui/core/Grid";
import GridItem from "./components/Grid/GridItem.js";
import Card from "./components/Card/Card.js";
import CardHeader from "./components/Card/CardHeader.js";
import CardBody from "./components/Card/CardBody.js";
import CardFooter from "./components/Card/CardFooter.js";
import { ClassesPlot, Cluster2CmpPlot } from "./cascade/3d-plots.js";
import ClassesIcon from '@material-ui/icons/Category';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import FormGroup from '@material-ui/core/FormGroup';
import Select from '@material-ui/core/Select';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import { InfoTooltip, morphologyLabelDesc } from './utils';
import legendSiaPlotly from './images/legend-sia-plotly.png';
//import { getClassData } from "./utils";

const getName = (clusterInfo, shortName) => {
  let name = "cluster-id " + clusterInfo.name + ' of ' + shortName(clusterInfo);
  name += " | size: " + Math.abs(clusterInfo.size) + ", savi-morph.: " + clusterInfo.savimorph;
  return name;
};

const  fetchClusterInfo = async (id) => {
  const clusterJson = await fetch('csaransh/clustercoords/' + id);
  const cluster =  await clusterJson.json();
  return cluster;
}

const  fetchClusters = async (queryString) => {
  const addss = 'csaransh/clustershdb' + queryString;
  //console.log("fetching clusters with ", addss);
  const classJson = await fetch(addss);
  const rowData =  await classJson.json();
  return rowData;
}

export class ClusterClassesPlot extends React.Component {
  constructor(props) {
    super(props);
    this.allModes = [{label:"SaVi+Hdbscan", value:"savi"}];
    /*
    for (const k in window.cluster_classes) {
      this.allModes.push({label:k, value:k});
    }
    */
    const curMode = this.allModes[0].value;
    this.state = {
      classData : {ditraces: {}, traces:[]},
      nm: '',
      showcid: -1,
      curCluster: {},
      curMode: curMode
    };
  }

  componentDidMount(prevProps) {
    if (prevProps !== undefined && (prevProps.queryString === this.props.queryString)) return;
    //console.log("mounting clusterclasses", this.props.queryString);
    fetchClusters(this.props.queryString).then(classData => {
      this.setState({
        classData
      });
    });
  }

  handleShow(label, clusterIndex) {
    const labelIndex = this.state.classData.ditraces[label];
    const showcid = this.state.classData.traces[labelIndex].id[clusterIndex];
    fetchClusterInfo(showcid).then(clusterInfo => {
      this.setState({
        showcid,
        nm: getName(clusterInfo, this.props.shortName),
        curCluster: clusterInfo
      });
    });
  }

  handleMode(curMode) {
    /*
    this.setState({
      curMode,
    })
    */
  }

  onPointClick(data) {
    this.handleShow(data.points[0].fullData.name, data.points[0].pointNumber);
    //this.handleShow(data.points[0].pointNumber);
  }

  shouldComponentUpdate(nextProps, nextState){
    return this.state.classData.traces.length === 0 || this.state.showcid != nextState.showcid || this.state.curMode != nextState.curMode;
  }

  render() {
    //console.log("classData", this.state.classData);
    return (
    <Card chart>
      <CardHeader color="info">
      Defect Morphology Classes and Statistics
      </CardHeader>
      <CardBody>
        <Grid container>
          <GridItem xs={12} sm={12} md={7}>
          <Paper>
            <InfoTooltip
                text={"Each point in the plot represents a defect cluster and is colored based on its morphology. Click on a point on left to view the defect on right. Axes represent latent space found such that similar defect shapes and sizes are clustered together. Click / double click on legend to toggle the morphology visibility."}
                contents={
                  morphologyLabelDesc
                }
                onLeft
                marginTop="18px"
                marginLeft="38px"
            />
          <ClassesPlot mode={this.state.curMode} traces={this.state.classData.traces} clickHandler={(dt)=>this.onPointClick(dt)} />
        <Grid container justifyContent="center">
        <GridItem xs={12} sm={12} md={12} >
        <FormGroup>
         <FormControl>
          <InputLabel htmlFor="cid-select">Classification type</InputLabel>
          <Select
            value={this.state.curMode}
            onChange={(event) => { this.handleMode(event.target.value); }}
            inputProps={{
              name: 'class-mode',
              id: 'class-mode',
            }}
          >
          {this.allModes.map((o, i) => <MenuItem key={i} value={o.value}>{o.label}</MenuItem>)}
          </Select>
          </FormControl>
        </FormGroup>
        </GridItem>
        </Grid>
          </Paper>
          </GridItem>
          <GridItem xs={12} sm={12} md={5}>
            <InfoTooltip
                contents={<img style={{width:'250px'}} src={legendSiaPlotly} alt="legend..."/>}
                onRight
                marginTop="18px"
                marginLeft="38px"
            />
          <Cluster2CmpPlot  cid={this.state.showcid} row={this.state.curCluster} defectData={this.state.curCluster}/>
          <Typography  variant="caption" align="center" color="primary" display="block">{this.state.nm}</Typography>
          </GridItem>
        </Grid>
      </CardBody>
      <CardFooter chart>
        <div className={this.props.classes.stats}>
          <ClassesIcon/> Shows defect morphology classification. Click on a point on left to view the cluster on right. <span>References for algorithms used: <a href="https://doi.org/10.1016/j.commatsci.2021.110474">SaVi</a>, <a href="https://www.sciencedirect.com/science/article/pii/S0927025619306639">Defect similarity and clustering</a></span>.
        </div>
      </CardFooter>
   </Card>
    );
  }
}
          //<ScatterLinePlot coords={this.state.clusterCoords} colorIndex={this.state.curIndex}/k
