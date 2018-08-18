import React, { Component } from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';
import AppBar from 'material-ui/AppBar';
import FontIcon from 'material-ui/FontIcon';
import {blue500, red500, greenA200} from 'material-ui/styles/colors';
import ContentScreen from './ContentScreen';

import LoginScreen from './Loginscreen'
import RaisedButton from 'material-ui/RaisedButton';
import axios from 'axios';

class Dashboard extends Component {
  constructor(props) {
    console.log(props);
    super(props);
    this.userId = props.userId;
    this.role = props.role;
    this.state = {draweropen: false,currentScreen:[]};
  }
  componentDidMount(){
    var currentScreen=[];
    currentScreen.push(<ContentScreen appContext={this.props.appContext} role={this.props.role} userId={this.props.userId}/>);
    this.setState({currentScreen})
  }
  /**
   * Toggle opening and closing of drawer
   * @param {*} event
   */
  toggleDrawer(event){
  // console.log("drawer click");
  this.setState({draweropen: !this.state.draweropen})
  }


  handleMenuClick(event,page){
    switch(page){
      case "openprint":
      // console.log("need to open uploadapge")
      var currentScreen=[];
      currentScreen.push(<ContentScreen appContext={this.props.appContext} role={this.props.role} userId={this.props.userId}/>);
      this.setState({currentScreen})
      break;
      case "openpast":
      // console.log("need to open pastfiles")
      var currentScreen=[];

      this.setState({currentScreen})
      break;
      case "logout":
      var loginPage =[];
      loginPage.push(<LoginScreen appContext={this.props.appContext}/>);
      this.props.appContext.setState({loginPage:loginPage,contentScreen:[]})
      break;
    }
    this.setState({draweropen:false})
  }


  render() {
    var butttonLabel = "My Shifts";
    if(this.role=='manager') {
      butttonLabel = "Shift Browser";
    }

    return (
      <div className="App">
        <div>
          {this.state.currentScreen}
        </div>
      </div>
    );
  }
}

export default Dashboard;
