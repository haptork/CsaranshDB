import React from 'react';

import Grid from "@material-ui/core/Grid";
import GridItem from "components/Grid/GridItem.js";
import Card from "./components/Card/Card.js";
import CardHeader from "./components/Card/CardHeader.js";
import CardBody from "./components/Card/CardBody.js";
import CardFooter from "./components/Card/CardFooter.js";
import { ClusterClassPlot, ClassesPlot } from "./cascade/3d-plots.js";
import ClassesIcon from '@material-ui/icons/Category';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import FormGroup from '@material-ui/core/FormGroup';
import Select from '@material-ui/core/Select';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';

import { getClassData } from "./utils";

const getName = (clusterInfo, shortName) => {
  return "cluster-id " + clusterInfo.name + ' of ' + shortName(clusterInfo);
};

const  fetchClusterInfo = async (id) => {
  const clusterJson = await fetch('/clustercoords/' + id);
  const cluster =  await cascadeJson.json();
  return cluster;
}

const  fetchClusters = async (queryString) => {
  const classJson = await fetch('/clustershdb' + queryString);
  const rowData =  await classJson.json();
  return rowData;
}

export class ClusterClassesPlot extends React.Component {
  constructor(props) {
    super(props);
    this.allModes = [];
    for (const k in window.cluster_classes) {
      this.allModes.push({label:k, value:k});
    }
    const curMode = this.allModes[0].value;
    this.state = {
      classData : {id: [], x:[], y:[], morph:{'savi':[]}},
      nm: '',
      showIndex: -1,
      curCluster: {}
    };
  }

  componentDidMount(prevProps) {
    if (prevProps !== undefined && (prevProps.queryString === this.props.queryString)) return;
    fetchClusters(this.props.queryString).then(classData => {
      this.state = {
        classData
      }
    });
  }

  handleShow(showIndex) {
    fetchClusterInfo(classData['id'][showIndex]).then(clusterInfo => {
      this.setState({
        showIndex,
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
    //this.handleShow(data.points[0].fullData.name, data.points[0].pointNumber);
    this.handleShow(data.points[0].pointNumber);
  }

  shouldComponentUpdate(nextProps, nextState){
    return this.state.showIndex != nextState.showIndex || this.state.curMode != nextState.curMode;
  }

  render() {
    return (
    <Card chart>
      <CardHeader color="info">
      Cluster Classes
      </CardHeader>
      <CardBody>
        <Grid container>
          <GridItem xs={12} sm={12} md={6}>
          <Paper>
          <ClassesPlot mode={this.state.curMode} coords={this.state.classData} colorIndex={1} clickHandler={(dt)=>this.onPointClick(dt)} />
        <Grid container justify="center">
        <GridItem xs={12} sm={12} md={12} >
        <FormGroup column>
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
          <GridItem xs={12} sm={12} md={6}>
          <ClusterClassPlot curIndex={this.state.curIndex} classIndex={this.state.classIndex} curMode={this.state.curMode} data={this.props.data}/>
          <Typography  variant="caption" style={{textAlign:"center"}}>{this.state.nm}</Typography>
          </GridItem>
        </Grid>
      </CardBody>
      <CardFooter chart>
        <div className={this.props.classes.stats}>
          <ClassesIcon/> Shows defect morphology classification. Different classes are shown with different colors. Click on a point on left to view the cluster on right. Click on legend to toggle a class and double click on legend label to only make that class points appear. The image below shows typical morphologies. <span>Papers on methods: <a href="https://arxiv.org/abs/2009.14147">Graph</a>, <a href="https://www.sciencedirect.com/science/article/pii/S0927025619306639">unsupervised</a></span>.
        </div>
      </CardFooter>
   </Card>
    );
  }
}
          //<ScatterLinePlot coords={this.state.clusterCoords} colorIndex={this.state.curIndex}/k