import React from "react";
import {withStyles} from "@material-ui/core/styles";
//import PropTypes from "prop-types";
// core components
import Grid from "@material-ui/core/Grid";
import GridItem from "./components/Grid/GridItem";
import Footer from "./components/Footer/Footer.js";
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import classNames from 'classnames';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Accordion from '@material-ui/core/Accordion';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import dashboardStyle from "./assets/jss/material-dashboard-react/views/dashboardStyle.js";
// charts import
import { uniqueKey, getAllCol} from "./utils";
//import { MainTable } from "../cascades/MainTable";
//import {getCids, getInitialSelection} from "../cascades/ClusterCmpPlot";
//import {ClusterClassesPlot} from "../ClusterClasses.js";
//import {OutlineCards} from "../cascades/OutlineCards";
//import { getCurrentCascade } from "../cascades/CascadeVisualizer3D";
//import { Statistics } from "../statistics/Statistics";
//import { Comparison } from "../Comparison/Comparison";
import {CascadesAndClusterCmp} from "./cascade/CascadesAndClusterCmp";
//other components
import Select from 'react-select';
import Paper from '@material-ui/core/Paper';
//import { getCids, getInitialSelection } from "ClusterCmpPlot.js";

import MainTable from "./Maintable.js"
//import {ClusterClassesTrends} from "../ClusterClassesTrends.js";

const getCids = (row) => [];
const getInitialSelection = (row) => '';

/*
const styles = theme => ({
  heading: {
    fontSize: theme.typography.pxToRem(15),
  },
  secondaryHeading: {
    fontSize: theme.typography.pxToRem(15),
    color: theme.palette.text.secondary,
  },
  icon: {
    verticalAlign: 'bottom',
    height: 20,
    width: 20,
  },
  details: {
    alignItems: 'center',
  },
  column: {
    flexBasis: '33.33%',
  },
  helper: {
    borderLeft: `2px solid ${theme.palette.divider}`,
    padding: `${theme.spacing(1)}px ${theme.spacing(2)}px`,
    //padding: `${theme.spacing.unit}px ${theme.spacing.unit * 2}px`,
  },
});
*/
const  fetchCascadeInfo = async (id) => {
  const cascadeJson = await fetch('/cascade/' + id);
  const rowData =  await cascadeJson.json();
  return rowData;
}

export class DashboardSimple extends React.Component {
  constructor(props) {
      super(props);
      const data = [];
      this.allCols = getAllCol();
      const initialPick = -1;
      const initialRow = {'viewfields':{}};
      const initialLook = '';
      this.state = {
          data: [],
          curRows: [],
          //compareRows: new Set(),
          except: new Set(),
          look: initialLook,
          mobileOpen: false,
          lookrow: initialRow,
          cidCmp: getInitialSelection(initialRow),
          allCids: getCids(initialRow),
          showCol: this.allCols.filter(x => x['isShow'])
      };
  }

  componentDidMount(prevProps) {
    //if (prevProps === undefined) return;
    //console.log("In dashboard comp did mount");
    if (prevProps !== undefined && (prevProps.queryString === this.props.queryString)) return;
    fetch('/cascades'+this.props.queryString)
      .then(res=>res.json())
      .then(cascades => {
        const data = cascades;
        if (data.length === 0) return;
        const initialPick = 0;
        const initialRow = data[initialPick];
        const initialLook = uniqueKey(initialRow);
        fetchCascadeInfo(initialRow.id).then(rowData => {
          console.log(initialRow.id);
          console.log(rowData);
          this.setState({
            data : data,
            curRows : data,
            lookrow : rowData,
            // compareRows: new Set(),
            except : new Set(),
            look : initialLook,
            mobileOpen : false,
            cidCmp : getInitialSelection(initialRow),
            allCids : getCids(initialRow),
            showCol : this.allCols.filter(x => x['isShow'])
          });
        });
      });
  }

  shortName = (row) => {
    let name = row.id;
    for (const x of this.state.showCol) {
      if (x.type != 'input') continue;
      name += "-" + x.parseFn(x.accessor(row));
    }
    return name;
  }

  handleShowCols = showCol => {
   this.setState(
      { showCol }
    );
  };

  handleClusterCmp(cid) {
    cid = '' + cid;
    if (!this.state.lookrow.features.hasOwnProperty(cid)) return;
    this.setState ({
      cidCmp : cid
    });
  }

  handleToggleDrawer = () => {
    this.setState({ mobileOpen: !this.state.mobileOpen });
  };

  handleHideDrawer = () => {
    if (this.state.mobileOpen === false) return;
    this.setState({ mobileOpen: false });
  };

  handleShowDrawer = () => {
    if (this.state.mobileOpen === true) return;
    this.setState({ mobileOpen: true });
  };

  setRows(curRows) {
    this.setState({
      curRows,
    });
  }

  exceptCurRowHandler(row) {
    const isExcepted = this.state.except.has(uniqueKey(row));
    let except = new Set(this.state.except);
    if (isExcepted) {
      except.delete(uniqueKey(row));
    } else {
      except.add(uniqueKey(row));
    }
    this.setState({
      except
    });
  }

  lookCurRowHandler(row) {
    const newRowId = uniqueKey(row);
    const isLooking = (this.state.look === newRowId)
    if (isLooking) return;
    //const compareRows = new Set(this.state.compareRows);
    //compareRows.add(uniqueKey(row));
    fetchCascadeInfo(newRowId).then(rowData => {
      console.log(newRowId);
      console.log(rowData);
      this.setState({
        look : newRowId,
        lookrow : rowData,
        cidCmp : getInitialSelection(row),
        allCids : getCids(row),
      });
    });
/*
    fetch('/cascades'+this.props.queryString)
      .then(res=>res.json())
      .then(cascades => {
        const data = cascades;
        const initialPick = data.length == 0 ? -1 : 0;
        const initialRow = (initialPick >= 0) ? data[initialPick] : {};
       this.setState({
          look: newRowId,
          lookrow: row,
          //compareRows,
          cidCmp: getInitialSelection(row),
          allCids: getCids(row)
        });
      });
      */
  }
    
    render() {
    let classes = this.props.classes;
    let openly = this.state.mobileOpen;
    const data =this.state.data;
    /*
    console.log("rendering dashboard.")
    console.log(data.length);
    console.log(this.state.curRows.length);
    */
    return (
      <div className="main-panel">
    <AppBar>
            <Toolbar disableGutters={!openly}>
             <Typography variant="h5" color="inherit" noWrap>
                <a id="logoTitle" href="https://github.com/haptork/csaransh">CSaransh</a>
              </Typography>
              <IconButton
                color="inherit"
                aria-label="open drawer"
                className={classNames(classes.menuButton, openly && classes.hide)}
              >
              </IconButton>

           </Toolbar>
    </AppBar>

        <ClickAwayListener onClickAway={this.handleHideDrawer}>
        <Grid id="mainTableC" /*justify="flex-end"*/ container> 
          <GridItem id="mainTable" xs={12}>
<Accordion id="mainTablePanel" expanded={this.state.mobileOpen} onChange={this.handleToggleDrawer}>
          <AccordionSummary /*onMouseEnter={this.handleShowDrawer}*/ expandIcon={<ExpandMoreIcon />}>
            <Typography className={classes.heading}>Cascades List - {this.state.curRows.length} cascades {(this.state.curRows.length < data.length) ? " filtered out of total " + data.length : " - Filter, View, Plot Using Action Buttons"} 
           </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <div style={{display:"block", width:"100%"}}>
              <Select
                defaultValue={this.state.showCol}
                name="Table columns"
                closeOnSelect={false}
                isMulti
                isClearable={false}
                options={this.allCols}
                onChange={this.handleShowCols}
              />
              <MainTable
                  data={data}
                  except={this.state.except}
                  look={this.state.look}
                  setRows={(rows) => this.setRows(rows)}
                  onLookCur={o => this.lookCurRowHandler(o)}
                  onExceptCur={o => this.exceptCurRowHandler(o)}
                  showCol={this.state.showCol}
              />
            </div>
          </AccordionDetails>
       </Accordion>
          </GridItem>
          </Grid>
          </ClickAwayListener>

       <CascadesAndClusterCmp classes={classes} row={this.state.lookrow} cid={this.state.cidCmp} allCids={this.state.allCids} handleClusterCmp={(cid)=>this.handleClusterCmp(cid)} data={this.state.data} shortName={this.shortName}/>
      </div>
    );
//    return (
//      <div className="main-panel">
//    <AppBar>
//            <Toolbar disableGutters={!openly}>
//             <Typography variant="title" color="inherit" noWrap>
//                <a id="logoTitle" href="https://github.com/haptork/csaransh">CSaransh</a>
//              </Typography>
//  
//              <IconButton
//                color="inherit"
//                aria-label="open drawer"
//                className={classNames(classes.menuButton, openly && classes.hide)}
//              >
//              </IconButton>
//
//           </Toolbar>
//    </AppBar>
//
//        <Grid id="mainTableC" justify="flex-end"*/ container> 
//          <ClickAwayListener onClickAway={this.handleHideDrawer}>
//          <GridItem id="mainTable" xs={12}>
//<Accordion id="mainTablePanel" expanded={this.state.mobileOpen} onChange={this.handleToggleDrawer}>
//          <AccordionSummary /*onMouseEnter={this.handleShowDrawer}*/ expandIcon={<ExpandMoreIcon />}>
//            <Typography className={classes.heading}>Cascades List - {this.state.curRows.length} cascades {(this.state.curRows.length < data.length) ? " filtered out of total " + data.length : " - Filter, View, Plot Using Action Buttons"} 
//           </Typography>
//          </AccordionSummary>
//          <AccordionDetails>
//            <div style={{display:"block", width:"100%"}}>
//              <Select
//                value={this.state.showCol}
//                closeOnSelect={false}
//                multi
//                options={this.allCols}
//                onChange={this.handleShowCols}
//              />
//            </div>
//          </AccordionDetails>
//       </Accordion>
//          </GridItem>
//        </ClickAwayListener>
//          </Grid>
//          </div>
//        );
    }
}
export default withStyles(dashboardStyle)(DashboardSimple);
//export default DashboardSimple;
//export default withStyles(styles)(withStyles(dashboardStyle)(DashboardSimple));
//export default withStyles(dashboardStyle)(withStyles(styles)(DashboardSimple));
/*

*/
