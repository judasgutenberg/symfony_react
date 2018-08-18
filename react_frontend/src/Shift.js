import React, { Component } from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import axios from 'axios';
import ShiftDetail from './ShiftDetail';
import ShiftEditor from './ShiftEditor';
import UserDetails from './UserDetails';

class Shift extends React.Component {
  constructor(props) {
    console.log(props);
    super(props);
    this.data = props.data;
    this.userId = props.userId;
    this.role = props.role;
    this.shiftId = props.data.id;
  }

  /*
    Function:showUserInfo
    Parameters: event, userId
    Usage:gives info about a user
  */
  showUserInfo(event, userId){
    var self = this;
    console.log(userId);
    self.props.appContext.setState({contentDetails:['loading...']})
    axios.get(self.props.appContext.apiBaseUrl+ 'user/' + userId,{})
    .then(function (response) {
      var shiftEditor = <UserDetails  appContext={self.props.appContext} data={response.data} userId={self.userId}/>;
      self.props.appContext.setState({contentDetails:shiftEditor})

    });
  }

  /*
    Function:showShiftDetailsOrEdit
    Parameters: event
    Usage:handles the getting of an info about a shift for employees
    or presents an editor to managers
  */
  showShiftDetailsOrEdit(event){
    var request = require('superagent');
    console.log("showUserShifts",this.shiftId);

    var self = this;
    var endPointAddendum = '';
    if(self.role=='manager'){
      var endPointAddendum = '/true'; //add /true to include a dump of all users for use in dropdowns
    }

    console.log(self.props.appContext.apiBaseUrl);
    self.props.appContext.setState({contentDetails:["loading..."]});
    axios.get(self.props.appContext.apiBaseUrl+ 'shift/' + this.shiftId + endPointAddendum,{})
   .then(function (response) {

     if(response.data){
        console.log("got the shift details");
        if(self.role=='manager'){
          console.log('patch in a shift editor here')
          var shiftEditor = <ShiftEditor  appContext={self.props.appContext} data={response.data} shiftId={self.shiftId} userId={self.userId}/>;
          self.props.appContext.setState({contentDetails:shiftEditor})
        } else {
          let shiftDetails=[];
          shiftDetails.push(<h2>Others Working In This Shift</h2>);
          //iterate through your shifts and display a Shift Module for each one
          for(var i=0; i<response.data.overlaps.length; i++){
            shiftDetails.push(<ShiftDetail parentContext={this} appContext={self.props.appContext} data={response.data.overlaps[i]}  userId={self.userId}/>);
          }
          //self.props.appContext.setState({loginPage:[],contentScreen:shiftDetails})
          self.props.appContext.setState({contentDetails:shiftDetails})
        }
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

//Sat Apr 12 2014 12:22:00 GMT+1000 is the format we need

  render() {
    console.log(this.data);
    var employeeName = '';
    var detailsButtonLabel = "Others Working"
    if(this.data && this.data.employee && this.data.employee.name){
      employeeName = <a href='#' class='userInfoLink' onClick={(event)=>this.showUserInfo(event, this.data.employee.id)}>({this.data.employee.name})</a>;
    }
    if(this.role=='manager') {

        detailsButtonLabel = "Edit"
    }
    return (
      <div className='shiftContainer'>
      <MuiThemeProvider>
           <RaisedButton className='shiftDetailButton' label={detailsButtonLabel} primary={true}  onClick={(event) => this.showShiftDetailsOrEdit(event)}/>
      </MuiThemeProvider>
        <div className="shift">
          <div>

          <span class='dateRange'>{new Date(this.data.start_time).toString().split(' GMT')[0]}  to  {new Date(this.data.end_time).toString().split(' GMT')[0]}</span>
          {employeeName}
          </div>
        </div>
        </div>

    );
  }
}

export default Shift;