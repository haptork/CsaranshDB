import React from "react";

import ClusterIcon from "@material-ui/icons/BubbleChart";
import ScatterIcon from "@material-ui/icons/ScatterPlot";
import MeshIcon from "@material-ui/icons/HdrStrong";

import IntIcon from "@material-ui/icons/BugReportRounded";
import VacIcon from "@material-ui/icons/CropFree";
import AllIcon from "@material-ui/icons/CenterFocusStrong";
// core components
import Grid from "@material-ui/core/Grid";
import GridItem from "../components/Grid/GridItem.js";
import CustomTabs from "../components/CustomTabs/CustomTabs.js";
//import CustomTabs from "./WatCustomTab.js";
import ListIcon from '@material-ui/icons/List';
import ViewIcon from '@material-ui/icons/BubbleChart';
import Typography from '@material-ui/core/Typography';

import Accordion from '@material-ui/core/Accordion';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

// charts import
import { HeatMapC } from "./HeatMap";
import { ScatterPlot, ClusterPlot } from "../cascade/3d-plots.js";
import {ClusterCmpPlot} from "../cascade/ClusterCmpPlot";

import { toXyzArSplit, uniqueKey } from "../utils";
import SaviCascadeViz from "./SaviCascadeViz.js";
import { InfoTooltip } from '../utils';

/*
import {
  CascadeVisualizer3D,
  //removeCurrentCascade
} from "../cascade/CascadeVisualizer3D";
*/
//       <DrawIt coords={coords} lines={lines} comps={comps} clusters={clusters} clusterSizes={clusterSizes}/>
class CascadeViews1 extends React.Component {
  constructor(props) {
    super(props);
  }

  shouldComponentUpdate(nextProps, nextState) {
    return this.props.row.id != nextProps.row.id;
  }

  render() {
    const { classes } = this.props;
    //const row = this.props.row;
    const row = this.props.row.viewfields;
    const curXyzCoords = toXyzArSplit(row);
    console.log(row);
    return (
          <GridItem xs={12} sm={12} md={7}>
       <CustomTabs
              title={"3D"}
              headerColor="info"
              tabs={[
                {
                  tabName: "Savi-Cascade",
                  tabIcon: ClusterIcon,
                  tabContent: (
                    <div>
                      <SaviCascadeViz handleCmp={this.props.handleClusterCmp} boxsize={row.boxsize} camerapos={row.simboxfoc} coords={row.coords} saviInfo={row.savi} siavenu={row.siavenu} clusters={row.clusters} clustersizes={row.clustersizes}/>
                    </div>
                  ),
                  footerContent: (
                    <div className={classes.stats}>
                      <ClusterIcon/> Click on a cluster to find similar clusters in the section below
                    </div>
                  )
                },
                {
                  tabName: "Scatter",
                  tabIcon: ScatterIcon,
                  tabContent: (
                  <ScatterPlot
                    coords={curXyzCoords}
                  />
                  ),
                  footerContent: (
                    <div className={classes.stats}>
                      <ScatterIcon/> Uses Eigen basis, Clustered vacs can give measure of subcascades,
                       as given in the subcascade density.
                    </div>
                  )
                },
                {
                  tabName: "Damage spots",
                  tabIcon: MeshIcon,
                  tabContent: (
                 <ClusterPlot row={row}/>
                 ),
                  footerContent: (
                    <div className={classes.stats}>
                      <MeshIcon/> Uses Eigen basis, Meshes of vacancies in different subcascades.
                    </div>
                  )
                }
              ]}
            />
          </GridItem>
   );
  }
}

class CascadeViews2 extends React.Component {
  constructor(props) {
    super(props);
  }

  shouldComponentUpdate(nextProps, nextState) {
    return this.props.row.id != nextProps.row.id;
  }

  render() {
    const { classes } = this.props;
    //console.log("viewfields is");
    //console.log(this.props.row.viewfields);
    const row = this.props.row.viewfields;
    const curXyzCoords = toXyzArSplit(row);
    //console.log(row);
    //console.log(curXyzCoords);
    return (
          <GridItem xs={12} sm={12} md={5}>
       <CustomTabs
              title={"2D Eigen Contours"}
              headerColor="info"
              tabs={[
                {
                  tabName: "Vacancy",
                  tabIcon: VacIcon,
                  tabContent: (
                 <div>
                 <InfoTooltip
                     text={"Shows vacancy contour on two principal axes of the cascade. This is a good indicator of major damage spots or sub-cascades."}
                     onLeft
                     margin="15px"
                 />
                 <HeatMapC coords={curXyzCoords[1]}/>
                  </div>
                  ),
                  footerContent: (
                    <div className={classes.stats}>
                      <VacIcon/> Shows density variations, helpful in estimating major subcascades
                    </div>
                  )
                },
                {
                  tabName: "SIA",
                  tabIcon: IntIcon,
                  tabContent: (
                    <div>
                 <InfoTooltip
                     text={"Shows SIA contour on two principal axes of the cascade."}
                     onLeft
                     margin="15px"
                 />
                 <HeatMapC coords={curXyzCoords[0]}/>
                 </div>
                  ),
                  footerContent: (
                    <div className={classes.stats}>
                      <IntIcon/> Shows density variations, helpful in estimating major clusters of interstitials.
                    </div>
                  )
                },
                {
                  tabName: "Both",
                  tabIcon: AllIcon,
                  tabContent: (
                    <div>
                 <InfoTooltip
                     text={"Shows SIA & vacancy contour on two principal axes of the cascade."}
                     onLeft
                     margin="15px"
                 />
                 <HeatMapC coords={curXyzCoords[2]}/>
                </div>
                 ),
                  footerContent: (
                    <div className={classes.stats}>
                      <AllIcon/> Shows density variations, helpful in estimating size along major principle axes.
                    </div>
                  )
                }
              ]}
            />
          </GridItem>
    );
  }
}

export class CascadesAndClusterCmp extends React.Component {
  constructor(props) {
    super(props);
  }
  
  shouldComponentUpdate(nextProps, nextState) {
    return uniqueKey(this.props.row) != uniqueKey(nextProps.row) || this.props.cid != nextProps.cid;
  }

  /*
  static getDerivedStateFromProps(props, state) {
    if (props.row.id !== this.props.row.id) {
      return {
        prevPropsUserID: props.userID,
        email: props.defaultEmail
      };
    }
    return null;
  }
  */
   
  render() {
    const { classes, row, allCids, cid, cmpData, data} = this.props;
    //console.log("rendering CascadesAndCmp");
    //console.log("cmpData", cmpData);
    return (
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <div className={classes.column}>
            <Typography className={classes.heading}>Visualize and Find Patterns</Typography>
          </div>
          <div className={classes.column}>
            <Typography className={classes.secondaryHeading}>Currently Viewing - {this.props.shortName(row)}</Typography>
          </div>
        </AccordionSummary>
        <AccordionDetails className={classes.details}>
        <Grid container>
          <CascadeViews1 classes={classes} row = {row} handleClusterCmp={this.props.handleClusterCmp}/>
          <CascadeViews2 classes={classes} row = {row} />

          <GridItem xs={12} sm={12} md={12}>
          <ClusterCmpPlot classes={classes} row={row} cid={cid} cmpData={cmpData} data={data} handleClusterCmp={this.props.handleClusterCmp} shortName={this.props.shortName} allCids={allCids}/>
          </GridItem>
       </Grid>

        </AccordionDetails>
        </Accordion>
    );
  }
}
/*
          */
