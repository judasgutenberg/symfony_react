import React, { Component } from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import axios from 'axios';



class UserDetails extends React.Component {
  constructor(props) {
    console.log(props);
    super(props);
    this.data = props.data;
    this.userId = props.userId;
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

  render() {
    var phoneMarkup = "no phone"
    if(this.data.phone){
      phoneMarkup = <span>Phone: <a href={'tel:' + this.data.phone}>{this.data.phone}</a></span>
    }
    var emailMarkup = "no email"
    if(this.data.email){
      emailMarkup = <span>Email: <a href={'mailto:' + this.data.email}>{this.data.email}</a></span>
    }
    return (

        <div className="shiftDetail">
        <h2>User Contact Information</h2>
          <div>
             {this.data.name} ({this.data.role}) -  {phoneMarkup} {emailMarkup}
          </div>
        </div>

    );
  }
}

export default UserDetails;
