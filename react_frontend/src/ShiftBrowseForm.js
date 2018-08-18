import React, { Component } from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import axios from 'axios';
import TextField from 'material-ui/TextField';
import MenuItem from 'material-ui/MenuItem';
import Shift from './Shift';

class ShiftBrowseForm extends React.Component {
  constructor(props) {
    console.log(props);
    super(props);
    this.userId = props.userId;
    this.state={
      start_time: new Date().toString().split(' GMT')[0] ,
      end_time:  new Date().toString().split(' GMT')[0]
    }
  }

  /*
    Function:narrowDateRange
    Parameters: event
    Usage:uses the date range to narrow the returned schedule data
  */
  narrowDateRange(event) {
      var request = require('superagent');
      console.log("showUserShifts",this.userId);
      var self = this;
      axios.get(self.props.appContext.apiBaseUrl+'shift/range/' + this.state.start_time + '/' +  this.state.end_time, {})
     .then(function (response) {
       if(response.data.length>0){
         var shiftListLabel = "Shift List";
          let shiftList=[];
          shiftList.push(<h2>{shiftListLabel}</h2>);
          //iterate through your shifts and display a Shift Module for each one
          for(var i=0; i<response.data.length; i++){
            shiftList.push(<Shift key={i} parentContext={self.props.appContex} appContext={self.props.appContext} data={response.data[i]}  role='manager' userId={self.userId}/>);

          }
          self.props.appContext.setState({loginPage:[],contentScreen:shiftList})
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


  render() {

    return (
        <div className="shiftEditor">
        <h2>Shift Browser Range Limiter</h2>
        <MuiThemeProvider>
          <div>
           <TextField
             hintText="Beginning of date range"
             floatingLabelText="Start Time"
             value = {this.state.start_time}
             onChange = {(event,newValue) => this.setState({start_time:newValue})}
             />
           <br/>
           <TextField
             hintText="End of date range"
             floatingLabelText="End Time"
             value = {this.state.end_time}
             onChange = {(event,newValue) => this.setState({end_time:newValue})}
             />
           <br/>
           <RaisedButton label="Show" primary={true}   onClick={(event) => this.narrowDateRange(event)}/>
          </div>
         </MuiThemeProvider>
        </div>

    );
  }
}

export default ShiftBrowseForm;
