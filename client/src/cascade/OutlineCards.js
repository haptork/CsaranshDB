import React from "react";
import Grid from "@material-ui/core/Grid";
import GridItem from "../components/Grid/GridItem.js";
import Card from "../components/Card/Card.js";
import CardHeader from "../components/Card/CardHeader.js";
import CardIcon from "../components/Card/CardIcon.js";
// Icons
import ElemIcon from "@material-ui/icons/Grain";
import EnergyIcon from "@material-ui/icons/FlashOn";
import PlanarIcon from "@material-ui/icons/FilterBAndW";
import ClassesIcon from '@material-ui/icons/WbSunny';
import EditIcon from '@material-ui/icons/Edit';
import QueryDialog from "../QueryDialog.js";
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';

const Item = props => {
  const classes = props.classes;
  const Icon = props.icon;
//          <CardIcon color={props.color} onClick={() => { console.log('clicked') }} onClick={props.onClk(true)} ></CardIcon>
  return (
    <GridItem xs={12} sm={6} md={3}>
      <Card>
        <CardHeader color={props.color} stats icon onClick={() => props.onClk(true)} style={{cursor:"pointer"}}>
          <CardIcon color={props.color} >
            <Icon />
          </CardIcon>
          <span className={classes.cardCategory}>
            {props.val["title"]}
            <Tooltip title="Change Dataset" enterDelay={300}>
              <IconButton
                color="inherit"
                size="small"
                className="outlinebutton"
              >
                <EditIcon />
              </IconButton>
            </Tooltip>
            </span>
          <h3 className={classes.cardTitle}>
            {props.val["label"]} <small>{props.val["labelSm"]}</small>
          </h3>
        </CardHeader>
      </Card>
    </GridItem>
  );
};

export class OutlineCards extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showQueryDialog: false
    };
  }

  shouldComponentUpdate(nextProps, nextState){
    //return this.props.values[0].label.length == 0 ;
    return true;
  }

  handleQueryDialog = (showQueryDialog, values) => {
    if (!showQueryDialog) this.props.onClose(values)
    this.setState({showQueryDialog});
  }

  render () {
    const props = this.props;
    const colors = ["success", "warning", "primary", "info"];
    const icons = [ElemIcon, EnergyIcon, PlanarIcon, ClassesIcon];
    //const x = colors.map((c, i) => { return ( <Grid container className="content"> <Item onClk={this.handleQueryDialog} color={colors[0]} icon={icons[0]} val={props.values[0]} classes={props.classes}/> </Grid>);});
    //console.log(props.values);
    return (
      <Grid container className="content"> 
      {colors.map((c, i) => <Item onClk={this.handleQueryDialog} color={c} icon={icons[i]} key={i} val={props.values[i]} classes={props.classes}/>)}
      <QueryDialog open={this.state.showQueryDialog} setOpen={this.handleQueryDialog}/>
      </Grid>
    );
  }

}
    //<Grid container className="content"> <Item color={colors[0]} icon={icons[0]} val={props.values[0]} classes={props.classes}/> </Grid>