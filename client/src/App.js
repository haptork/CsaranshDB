import logo from './logo.svg';
//import './App.css';
import MainTable from "./Maintable.js"
import React, {Component, useEffect, useState, useContext} from 'react';
import {BrowserRouter as Router, Route, Switch, useParams, useLocation} from "react-router-dom";

import { uniqueKey, getAllCol } from "./utils";
import 'react-table-v6/react-table.css';

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      look: "",

    }
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

function Home() {
  const [cascades, setCascades] = useState([]);
  //console.log(useLocation().search);
  const queryString = window.location.search;

  useEffect(() => {
    fetch('/cascades'+queryString)
    .then(res => res.json())
    .then(cascades => setCascades(cascades));
  }, []);
      /*
      {cascades.map(cascade =>
        <div key={cascade.id}>{cascade.ndefects}</div>
        )}
        */
  return (
    <div >
      <h1>Cascades</h1>
      <Dashboard data={cascades}/>
    </div>
  );
}

function About() {
  return (
    <p>Developed by haptork at BARC. </p>
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
