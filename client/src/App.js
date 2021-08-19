import logo from './logo.svg';
//import './App.css';
import React, {Component, useEffect, useState, useContext} from 'react';
import {BrowserRouter as Router, Route, Switch, useParams, useLocation} from "react-router-dom";

import { uniqueKey, getAllCol } from "./utils";
import 'react-table-v6/react-table.css';
import 'react-table-v6/react-table.css';
import './css/material-dashboard-react.css';
import './css/index.css';
import './css/style.css';
import Dashboard from './Dashboard';

/*
class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = { }
  }

  render() {
    return(
    <MainTable
      data={this.props.data}
      except={new Set()}
      look={""}
      setRows={(rows) => {}}
      onLookCur={o => {}}
      onExceptCur={o => {}}
      showCol={getAllCol()}
    />
    );
  }
}
*/

class HomeOld extends Component {
  constructor(props) {
    super(props);
    //this.state = { isFetching: true }
    this.state = {cascades : []};
    this.queryString = window.location.search;
  }
      /*
  componentDidMount() {
    fetch('/cascades'+this.queryString)
      .then(res=>res.json())
      .then(cascades => this.setState({cascades}));
    console.log(cascades.length);
    this.setState({cascades});
  }
    */

  render() {
    return(
      <div>
      <Dashboard queryString={this.queryString}/>
      </div>
    );
  }
}

function Home() {
  //const [cascades, setCascades] = useState([]);
  //console.log(useLocation().search);
  const queryString = window.location.search;

  /*
  useEffect(() => {
    fetch('/cascades'+queryString)
    .then(res => res.json())
    .then(cascades => setCascades(cascades));
  }, []);
  */
  return (
    <div >
      <Dashboard queryString={queryString}/>
    </div>
  );
}

function About() {
  return (
    <p>Developed by haptork at BARC, India. </p>
  );
}

function Error() {
  return (
    <p>404 Error</p>
  );
}


function App() {
  //console.log(useLocation());
  //console.log(useParams());
  return (
    <div>
    <Home/>
    </div>
  );
  /*
   <div>
    <Router>
    <div className="App">
      <Route path = '/'  component = {Home}/>
      <Route path = '/about' component = {About}/>
    </div>
   </Router>
   </div> 
  );
  */
}

export default App;
