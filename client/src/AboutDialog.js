import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import logo from './images/logo192.png';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import GithubIcon from "@material-ui/icons/GitHub";
import DescIcon from "@material-ui/icons/Description";
import FavIcon from "@material-ui/icons/Favorite";
//import { makeStyles } from '@material-ui/core/styles';
import iaeaLogo from "./images/iaea-logo.png";
import barcLogo from "./images/barc-logo.jpg";
import Grid from "@material-ui/core/Grid";
import GridItem from "./components/Grid/GridItem";
import Avatar from '@material-ui/core/Avatar';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
//const classes = useStyles();
const styles = (theme) => ({
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
});

const CustomDialogTitle = withStyles(styles)((props) => {
  const { children, classes, onClose, ...other } = props;
  return (
    <DialogTitle disableTypography className={classes.root} {...other}>
      <Typography variant="h6">{children}</Typography>
      {onClose ? (
        <IconButton aria-label="close" className={classes.closeButton} onClick={onClose}>
          <CloseIcon />
        </IconButton>
      ) : null}
    </DialogTitle>
  );
});

export default function AboutDialog(props) {
  //const [open, setOpen] = React.useState(false);
  const handleClickOpen = () => props.setOpen(true);
  const handleClose = () => props.setOpen(false);
  return (
    <div>
        <img id="logoImg" src={logo} alt="Csaransh" onClick={handleClickOpen}/>
      <Dialog
        open={props.open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <CustomDialogTitle id="alert-dialog-title" onClose={handleClose}>
            <div style={{textAlign:"center"}}>
              <img src={logo} alt="Csaransh" style={{marginTop:"-20px"}}/>
            <div style={{marginTop:"-20px", marginBottom:"-15px"}}>
           <Typography style={{display:"inline"}} variant="subtitle2">Cascades Saransh v0.5 </Typography>
            <Tooltip title="GitHub repository" enterDelay={300}>
              <IconButton
                component="a"
                color="inherit"
                href="https://github.com/haptork/csaransh"
                aria-label="GitHub repository"
                size="small"
              >
                <GithubIcon />
              </IconButton>
            </Tooltip>
            </div>
              </div>
        </CustomDialogTitle>
        <DialogContent dividers style={{paddingBottom:"5px"}}>
    <DialogContentText id="alert-dialog-description" style={{textAlign:"center"}}>
    Links to explore algorithms, related publications and codes
    </DialogContentText>
    <Grid container>

    <GridItem xs={12} sm={6} md={6}>
    <List>
      <ListItem button component="a">
        <ListItemAvatar>
        <Tooltip title="aVi GitHub repository" enterDelay={300}>
              <IconButton
                component="a"
                color="inherit"
                href="https://github.com/haptork/AnuVikar"
                aria-label="GitHub repository"
              >
                <GithubIcon />
              </IconButton>
          </Tooltip>
        </ListItemAvatar>
        <ListItemText primary="AnuVikar" secondary="Csaransh's analysis algorithms" />
      </ListItem>
      <ListItem button component="a" href="https://doi.org/10.1016/j.commatsci.2021.110474">
        <ListItemAvatar button
                component="a"
                href="https://doi.org/10.1016/j.commatsci.2021.110474"
        >
        <Tooltip title="SaVi journal publication" enterDelay={300}>
              <IconButton
                color="inherit"
                component="a"
                href="https://doi.org/10.1016/j.commatsci.2021.110474"
              >
                <DescIcon />
              </IconButton>
          </Tooltip>
        </ListItemAvatar>
        <ListItemText primary="SaVi" secondary="defect morphology identification" />
      </ListItem>

      </List>
      </GridItem>
    <GridItem xs={12} sm={6} md={6}>
    <List>
      <ListItem button component="a" href="https://doi.org/10.21105/joss.01461">
        <ListItemAvatar>
        <Tooltip title="Csaransh JOSS Publication" enterDelay={300}>
              <IconButton
                component="a"
                color="inherit"
                href="https://doi.org/10.21105/joss.01461"
              >
                <DescIcon />
              </IconButton>
          </Tooltip>
        </ListItemAvatar>
        <ListItemText primary="Csaransh" secondary="Analysis & Visualization Publication" />
      </ListItem>
      <ListItem button
      component="a"
      href="https://www.sciencedirect.com/science/article/pii/S0927025619306639"
      >
        <ListItemAvatar>
        <Tooltip title="ML Classification Publication" enterDelay={300}>
              <IconButton
                component="a"
                color="inherit"
                href="https://www.sciencedirect.com/science/article/pii/S0927025619306639"
                aria-label="GitHub repository"
              >
                <DescIcon />
              </IconButton>
          </Tooltip>
        </ListItemAvatar>
        <ListItemText primary="Defect Shapes" secondary="fast defect identification & ML classification " />
      </ListItem>

      </List>
      </GridItem>
      </Grid>
        </DialogContent>
            <Grid container>

                <GridItem xs={1} sm={1} md={2}>
                </GridItem>
                <GridItem xs={4} sm={4} md={3} style={{display:"flex", justifyContent:"center", alignItems:"center"}}>
              <img alt="BARC" src={barcLogo} style={{width:"72px"}} />
              </GridItem>
                <GridItem xs={2} sm={2} md={2} style={{display:"flex", justifyContent:"center", alignItems:"center"}}>
              <Avatar style={{backgroundColor:"coral"}}> <FavIcon /> </Avatar>
              </GridItem>
                <GridItem xs={4} sm={4} md={3} style={{display:"flex", justifyContent:"center", alignItems:"center"}}>
              <img alt="IAEA" src={iaeaLogo} style={{width:"72px"}} />
              </GridItem>
                <GridItem xs={1} sm={1} md={2}>
                </GridItem>
                <GridItem xs={1} sm={1} md={2}>
                </GridItem>
                <GridItem xs={4} sm={4} md={3} style={{display:"flex", justifyContent:"center", alignItems:"center"}}>
                    Csaransh
              </GridItem>
                <GridItem xs={2} sm={2} md={2} style={{display:"flex", justifyContent:"center", alignItems:"center"}}>
                    for
              </GridItem>
                <GridItem xs={4} sm={4} md={3} style={{display:"flex", justifyContent:"center", alignItems:"center"}}>
                    CascadesDB
              </GridItem>
                <GridItem xs={1} sm={1} md={2}>
                </GridItem>

            </Grid>
      </Dialog>
    </div>
  );
}