import React, { Component } from 'react';
import injectTapEventPlugin from 'react-tap-event-plugin';
import './App.css';
import LoginScreen from './Loginscreen';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import AppBar from 'material-ui/AppBar';
import RaisedButton from 'material-ui/RaisedButton';
import axios from 'axios';
import Shift from './Shift';
import ShiftEditor from './ShiftEditor';
import WeeklySummary from './WeeklySummary';
import ShiftBrowseForm from './ShiftBrowseForm';

//the base url of our symfony-based backend
const apiBaseUrl ="http://localhost:8000/api/";


class App extends Component {
  constructor(props){
    super(props);
    this.state={
      loginPage:[],
      contentScreen:[]
    }
    this.apiBaseUrl= apiBaseUrl;
    this.userName= "";
    this.userId= "";
    this.role = "";
  }

  componentWillMount(){
    var loginPage =[];
    loginPage.push(<LoginScreen appContext={this}/>);
    this.setState({
                  loginPage:loginPage
                    })
  }


  /*
    Function:showUserShifts
    Parameters: event
    Usage:handles the getting of an employee's shifts
  */
  showUserShifts(event){
    var request = require('superagent');
    console.log("showUserShifts",this.userId);
    var self = this;
    var payload={};
    axios.get(apiBaseUrl+'usershifts/' + this.userId, payload)
   .then(function (response) {

     if(response.data.length>0){
       var shiftListLabel = "Your Shifts";
       console.log(self.role);
       if(self.role == 'manager'){
         shiftListLabel = "All Shifts";
       }
       console.log("got the shifts!");
        let shiftList=[];
        shiftList.push(<h2>{shiftListLabel}</h2>);
        //iterate through your shifts and display a Shift Module for each one
        for(var i=0; i<response.data.length; i++){
          shiftList.push(<Shift key={i} parentContext={this} appContext={self} data={response.data[i]}  role={self.role} userId={self.userId}/>);

        }
        self.setState({loginPage:[],contentScreen:shiftList})
     } else {
       console.log("some error ocurred",response.data.error);
       alert(response.data.error);
     }
  })
    .catch(function (error) {
     alert(error);
     console.log(error);

    });
  }

  shiftBrowseForm(event){
    var self = this;
    var shiftEditor = <ShiftBrowseForm  appContext={self} userId={self.userId}/>;
    self.setState({contentDetails:shiftEditor})
  }

  createShift(event){
    var self = this;
    console.log(self.apiBaseUrl);
    self.setState({contentDetails:["loading..."]});
    axios.get(self.apiBaseUrl + 'shift/null/1')
     .then(function (response) {
       if(response.data){
          console.log("got the shift details");
        var shiftEditor = <ShiftEditor  appContext={self} data={response.data} userId={self.userId}/>;
        self.setState({contentDetails:shiftEditor})
      }
    });
  }

  weeklySummaryReport(event){
    var self = this;
    console.log(self.apiBaseUrl);
    self.setState({contentDetails:["loading..."]});
    axios.get(self.apiBaseUrl + 'user/weeklysummary/' + this.userId)
     .then(function (response) {
       if(response.data){
          console.log("got the weekly summary report!!");
        var summary = <WeeklySummary  appContext={self} data={response.data} userId={self.userId}/>;
        self.setState({contentDetails:summary})
      }
    });
  }

  render() {
    var butttonLabel = "My Shifts";
    if(this.role=='manager') {
      butttonLabel = "Shift Browser";
    }

    var title="Dashboard";
    var showShiftsButton = '';
    var extraButton =
      <RaisedButton  label='Weekly Summary Report' primary={true}  onClick={(event) => this.weeklySummaryReport(event)}/>


    if(this.userName!='') {
      title+=" for " + this.userName;
      title+=" (" + this.role + ")";
      if(this.role=='manager'){
        extraButton =
        <span>
          <RaisedButton  label='Create Shift' primary={true}  onClick={(event) => this.createShift(event)}/>
          <RaisedButton  label='Browse Schedule By Date Range' primary={true}  onClick={(event) => this.shiftBrowseForm(event)}/>
        </span>
      }
      showShiftsButton =
      <MuiThemeProvider>
           <RaisedButton  label={butttonLabel} primary={true}  onClick={(event) => this.showUserShifts(event)}/>
           {extraButton}
      </MuiThemeProvider>
    }

    return (
      <div className="App">
        <MuiThemeProvider>
          <AppBar title={title}/>
          </MuiThemeProvider>
          {showShiftsButton}
        {this.state.loginPage}
        {this.state.contentScreen}<br/>
        {this.state.contentDetails}
      </div>
    );
  }
}

export default App;
