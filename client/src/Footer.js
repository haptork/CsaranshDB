import React from "react";
import PropTypes from "prop-types";
// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import ListItem from "@material-ui/core/ListItem";
import List from "@material-ui/core/List";
// core components
import footerStyle from "./assets/jss/material-dashboard-react/components/footerStyle";
import iaeaLogo from "./images/iaea-logo.png";
import barcLogo from "./images/barc-logo.jpg";
import dhwajLogo from "./images/dhwaj.png";
import Grid from "@material-ui/core/Grid";
import GridItem from "./components/Grid/GridItem";


function Footer({ ...props }) {
  const { classes } = props;
  return (
    <footer className={classes.footer}>
      <div className={classes.container}>
        <Grid container>

        <GridItem xs={4} sm={4} md={4}>
        <div className={classes.left}>
          <List className={classes.list}>
            <ListItem className={classes.inlineBlock}>
            <a href="https://github.com/haptork/csaransh" className={classes.a}>
              Github Repository
            </a>
            </ListItem>
            <ListItem className={classes.inlineBlock}>
            <a href="http://joss.theoj.org/papers/72f2ddde2112497826753319956ea8ab" className={classes.a}>
              Csaransh citation link
            </a>
            </ListItem>
          </List>
       </div>
       </GridItem>
        <GridItem xs={4} sm={4} md={4}>
          <p className={classes.right}>
          <span>
          </span>
          </p>
        </GridItem>
        <GridItem xs={4} sm={4} md={4}>
          <span className={classes.right}>
            &copy; {1900 + new Date().getYear()}{" "} GPL Licence | IAEA | BARC |
          <img alt="India" src={dhwajLogo} style={{width:"32px"}} />
          </span>
       </GridItem>
      </Grid>
      </div>
    </footer>
  );
}
/*
          <List className={classes.list}>
            <ListItem className={classes.inlineBlock}>
              <a href="#home" className={classes.block}>
                About
              </a>
            </ListItem>
            <ListItem className={classes.inlineBlock}>
              <a href="#company" className={classes.block}>
                Contant
              </a>
            </ListItem>
          </List>
*/ 

Footer.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(footerStyle)(Footer);
