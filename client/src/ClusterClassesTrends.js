import React from 'react';

import Grid from "@material-ui/core/Grid";
import GridItem from "./components/Grid/GridItem.js";

import Card from "./components/Card/Card.js";
import CardHeader from "./components/Card/CardHeader.js";
import CardBody from "./components/Card/CardBody.js";
import CardFooter from "./components/Card/CardFooter.js";
import ViewIcon from '@material-ui/icons/BubbleChart';

import CompareIcon from '@material-ui/icons/InsertChart';
import CustomTabs from "./components/CustomTabs/CustomTabs.js";
import AngleIcon from "@material-ui/icons/CallSplit";
import DistIcon from "@material-ui/icons/LinearScale";
import StatsIcon from '@material-ui/icons/MultilineChart';

import { InfoTooltip, morphologyLabelDesc, dlOptions } from './utils';

import Paper from '@material-ui/core/Paper';
import Select from 'react-select';

import createPlotlyComponent from 'react-plotly.js/factory';
const Plotly = window.Plotly;
const Plot = createPlotlyComponent(Plotly);

const getTags = () => {
  const clusterClasses = window.cluster_classes;
  let picked = "";
  for (const key in clusterClasses) {
    if (picked.lenth == 0) picked = key;
    if (key.startsWith('line')) {
      picked = key;
    }
  }
  if ((picked.length) == 0) return {};
  return clusterClasses[picked].tags;
};

const groupByKey = (row, groupingLabels) => {
  let res = '';
  for (const label of groupingLabels) {
    res += row[label.value] + '_';
  }
  res = res.slice(0, -1); 
  return res;
};

const groupByName = (groupingLabels) => {
  let res = '';
  for (const label of groupingLabels) {
    res += label.value + '_';
  }
  res = res.slice(0, -1); 
  return res;
};

const createLabel = (row) => {
  let label = [];
  const ignoreLabels = new Set(["name", "ncascades", "npoints", "nclusters", "sizeLi", "label"]);
  for (const key in row) {
    if (ignoreLabels.has(key)) continue;
    label.push(row[key]);
  }
  row.label = label.join("_");
  return row.label;
}

const ClusterClassesEnergyBar1 = props => {
  const { data } = props;
  let morphs = [];
  let labels = []
  //console.log(data);
  for (const row of data) {
    const test = createLabel(row)
    //console.log(test);
    morphs.push(row.name);
    labels.push(createLabel(row));
  }
  //console.log(data);
  morphs = new Set(morphs);
  morphs = Array.from(morphs);
  labels = new Set(labels);
  labels = Array.from(labels);
  labels.sort();
  //console.log(labels);
  //console.log(morphs);
  let values = {};
  for (const label of labels) {
    values[label] = {};
  }
  for (const row of data) {
    values[row.label][row.name] = row.nclusters / row.ncascades;
  }
  //console.log(values);
  let traces = [];
  for (let label of labels) {
    //console.log(label);
    const curVal = values[label];
    //console.log(curVal);
    let ys = [];
    for (const morph of morphs) {
      ys.push(curVal[morph]);
    }
    //console.log(morphs, ys);
    traces.push({
      x: morphs,
      y: ys,
      type: 'line',
      name: label
    })
  }
  const layout = {
     margin: { l: 40, r: 20, b: 100, t: 20, pad: 1 },
     hovermode: "x",
     //barmode: 'stack',
     /*
     xaxis: {
       title: {
         text: "class labels"
       }
     },
     */
     yaxis: {
       title: {
         text: "avg. fraction of clusters per cascade"
       }
     }
  };
  return (
    <Plot data={traces} layout={layout} 
      style={{height: "340px", width: "100%"}}
    useResizeHandler
    config={dlOptions('csaransh_savi_distribution')}
    />
  );
}

const DefectSizeBoxPlot = props => {
  const { data } = props;
  let morphs = [];
  let labels = []
  //console.log(data);
  for (const row of data) {
    morphs.push(row.name);
    labels.push(createLabel(row));
  }
  morphs = new Set(morphs);
  morphs = Array.from(morphs);
  labels = new Set(labels);
  labels = Array.from(labels);
  labels.sort();
  //console.log(labels);
  //console.log(morphs);
  let values = {};
  for (const morph of morphs) {
    values[morph] = {};
  }
  for (const row of data) {
    values[row.name][row.label] = row.sizeLi;
  }
  let menuItems = [];
  let traces = [];
  let pre = 0;
  for (const curMorph of morphs) {
    let visibility = [];
    for (let i = 0; i < data.length; i++) visibility.push(false);
    for(let i = 0; i < Object.keys(values[curMorph]).length; i++) visibility[pre++] = true;
    //console.log(curMorph, visibility, values[curMorph].length);
    for (const label in values[curMorph]) {
      traces.push({
        y: values[curMorph][label],
        type: 'box',
        name: label,
        visible: curMorph === morphs[0],
        boxmean: 'sd',
        boxpoints: 'all',
        jiter: 0.5,
        whiskerwidth: 0.2,
        //fillcolor: 'cls',
        marker: {size: 2},
        line: {width: 1}

      })
    }
    menuItems.push({'method':'restyle', args:['visible', visibility], label:curMorph});
  }
  if (traces.length > 0) traces[0].visible = true;
  //console.log(data.length, pre);
  const updatemenus = [{
    y: 1,
    yanchor: 'top',
    buttons: menuItems
  }];
  const layout = {
     margin: { l: 20, r: 20, b: 100, t: 20, pad: 1 },
     updatemenus: updatemenus,
     yaxis: {
       title: {
         text: "defect size"
       }
     }
  };

  return (
    <Plot data={traces} layout={layout} config={{displayModeBar: false}}
      style={{height: "320px", width: "100%"}}
    useResizeHandler
    config={dlOptions('csaransh_savi_size_distribution')}
    />
  );
}

const  fetchMorphologyStats = async (queryString) => {
  const addss = 'csaransh/morphstats' + queryString;
  //console.log("fetching clusters with ", addss);
  const classJson = await fetch(addss);
  const rowData =  await classJson.json();
  return rowData;
}


export class ClusterClassesTrends extends React.Component {
  constructor(props) {
    super(props);
    this.tags = getTags();
    this.options = [
      { value: 'substrate', label: 'Material' },
      { value: 'energy', label: 'Energy' },
      { value: 'temperature', label: 'Temperature' },
      { value: 'potentialused', label: 'Potential' },
      { value: 'es', label: 'Electronic stopping' },
      { value: 'author', label: 'Author' },
    ];
    this.defaultGroupingLabels = this.options.slice(0, 1);
    this.state = {
      groupingLabels: this.defaultGroupingLabels,
      classData : [],
    };
  }

  cookQuery(labels) {
    let cols = [];
    for (let opt of labels) {
      cols.push(opt.value);
    }
    let qs = this.props.queryString;
    const connector = (qs.length === 0) ? "?" : "&";
    if (cols.length > 0) {
      qs += connector + "groupby=" + cols.join();
    }
    return qs;
  }

  componentDidMount(prevProps) {
    if (prevProps !== undefined && (prevProps.queryString === this.props.queryString)) return;
    fetchMorphologyStats(this.cookQuery(this.state.groupingLabels)).then(classData => {
      //console.log(classData);
      this.setState({
        classData
      });
    });
  }

  handleChange = groupingLabels => {
    fetchMorphologyStats(this.cookQuery(groupingLabels)).then(classData => {
      //console.log(classData);
      this.setState({
        classData,
        groupingLabels 
      });
    });
  };

  shouldComponentUpdate(nextProps, nextState) {
    return this.state.classData.length === 0  || this.state.groupingLabels != nextState.groupingLabels;
  }

  render() {
    const { groupingLabels, classData } = this.state;
    const { classes } = this.props;
    //console.log(classData);
    return (
      <Grid container>
       <GridItem xs={12} sm={12} md={12}>
          <Card chart>
            <CardHeader color="primary"> <span>Classification grouped by </span>
              <span style={{display:"inline-block", top:"8px", minWidth:"250px", color:"gray", position:"relative", marginLeft:"10px"}}>
              <Select
                value={groupingLabels}
                closeOnSelect={false}
                isMulti
                options={this.options}
                onChange={this.handleChange}
              />
              </span>
            </CardHeader>
            <CardBody>
         <Grid container justifyContent="center">
         <GridItem xs={12} sm={12} md={12}>
            <InfoTooltip
                text={"Shows average number of defects for each morphology. Select columns to grouping for compairing values between materials, energies, potentials etc. Click and drag to zoom."}
                contents={morphologyLabelDesc}
                onLeft
                marginTop="15px"
                marginLeft="15px"
            />

              <ClusterClassesEnergyBar1 data={classData} />
         </GridItem>
         </Grid>
         <Grid container justifyContent="center">
         <GridItem xs={12} sm={12} md={12}>
           <div style={{position:"relative"}}>
            <InfoTooltip
                text={"Shows size distribution for each morphology grouped by columns selected. Select morphology from the drop-down menu on left. Select columns to grouping for compairing values between materials, energies, potentials etc. Click and drag to zoom."}
                contents={morphologyLabelDesc}
                onLeft
                marginTop="0px"
            />
            <DefectSizeBoxPlot data={this.state.classData} groupingLabels={groupingLabels}/>
            </div>
          </GridItem>
         </Grid>
            </CardBody>
            <CardFooter chart>
              <div className={classes.stats}>
                <StatsIcon /> Distribution of defects among morphologies and morphology size distribution - Select grouping from the top selection.
              </div>
            </CardFooter>
          </Card>
        </GridItem>
      </Grid>
    );
  }
}