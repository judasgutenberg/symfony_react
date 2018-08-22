import React, { Component } from 'react';
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
const loading = <div className='message'>Loading...</div>;

class App extends Component {
  constructor(props){
    super(props);
    this.state={
      loginPage:[],
      contentScreen:[]
    }
    this.apiBaseUrl= apiBaseUrl;
    this.loading= loading;
    this.userName= "";
    this.userId= "";
    this.role = "";
  }

  componentWillMount(){
    var loginPage =[];
    loginPage.push(<LoginScreen key='1' appContext={this}/>);
    this.setState({loginPage:loginPage})
  }

  /*
    Function:showUserShifts
    Parameters: event
    Usage:handles the getting of an employee's shifts
  */
  showUserShifts(event){
    var self = this;
    self.setState({contentScreen:this.loading});
    axios.get(apiBaseUrl+'usershifts/' + this.userId, {})
   .then(function (response) {
     if(response.data.length>0){
       var shiftListLabel = "Your Shifts";
       if(self.role === 'manager'){
         shiftListLabel = "All Shifts";
       }
       console.log("got the shifts!");
        let shiftList=[];
        shiftList.push(<h2 key={-1}>{shiftListLabel}</h2>);
        //iterate through your shifts and display a Shift Module for each one
        for(var i=0; i<response.data.length; i++){
          shiftList.push(<Shift key={i} parentContext={this} appContext={self} data={response.data[i]}  role={self.role} userId={self.userId}/>);
        }
        self.setState({loginPage:[],contentScreen:shiftList})
        self.setState({contentDetails:[]})
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

  //logout the logged in user!
  logOut(event) {
    this.userName= "";
    this.userId= "";
    this.role = "";
    var loginPage =[];
    loginPage.push(<LoginScreen key='1' appContext={this}/>);
    this.setState({loginPage:loginPage})
    this.setState({contentDetails:[]})
    this.setState({contentScreen:[]})
  }

  shiftBrowseForm(event){
    var self = this;
    var shiftEditor = <ShiftBrowseForm appContext={self} userId={self.userId}/>;
    self.setState({contentDetails:shiftEditor})
    self.setState({contentScreen:[]})
  }

  createShift(event){
    var self = this;
    console.log(self.apiBaseUrl);
    self.setState({contentDetails:this.loading});
    axios.get(self.apiBaseUrl + 'shift/null/1')
     .then(function (response) {
       if(response.data){
          console.log("got the shift details");
        var shiftEditor = <ShiftEditor  appContext={self} data={response.data} userId={self.userId}/>;
        self.setState({contentDetails:shiftEditor})
        self.setState({contentScreen:[]})
      }
    });
  }

  weeklySummaryReport(event){
    var self = this;
    self.setState({contentDetails:this.loading});
    axios.get(self.apiBaseUrl + 'user/weeklysummary/' + this.userId)
     .then(function (response) {
       if(response.data){
          console.log("got the weekly summary report!!");
        var summary = <WeeklySummary  appContext={self} data={response.data} userId={self.userId}/>;
        self.setState({contentDetails:summary})
        self.setState({contentScreen:[]})
      }
    });
  }

  render() {
    var butttonLabel = "My Shifts";
    if(this.role==='manager') {
      butttonLabel = "Shift Browser";
    }

    var title="Dashboard";
    var showShiftsButton = '';
    var extraButton =
      <RaisedButton className='functionButton' label='Weekly Summary Report' primary={true}  onClick={(event) => this.weeklySummaryReport(event)}/>

    if(this.userName!=='') {
      title+=" for " + this.userName;
      title+=" (" + this.role + ")";
      if(this.role==='manager'){
        extraButton =
        <span>
          <RaisedButton className='functionButton' label='Create Shift' primary={true}  onClick={(event) => this.createShift(event)}/>
          <RaisedButton className='functionButton' label='Browse Schedule By Date Range' primary={true}  onClick={(event) => this.shiftBrowseForm(event)}/>
        </span>
      }
      showShiftsButton =
        <span>
          <MuiThemeProvider>
            <RaisedButton className='functionButton' label='Logout' primary={true}  onClick={(event) => this.logOut(event)}/>
          </MuiThemeProvider>
          <MuiThemeProvider>
            <RaisedButton className='functionButton' label={butttonLabel} primary={true}  onClick={(event) => this.showUserShifts(event)}/>
          </MuiThemeProvider>
          <MuiThemeProvider>
           {extraButton}
          </MuiThemeProvider>
        </span>
    }

    return (
      <div className="App">
        <MuiThemeProvider>
          <AppBar title={title}/>
          </MuiThemeProvider>
          {showShiftsButton}
        {this.state.loginPage}
        {this.state.contentDetails}<br/>
        {this.state.contentScreen}

      </div>
    );
  }
}

export default App;
