import React from 'react';
import axios from 'axios';
import UserDetails from './UserDetails';

class ShiftDetail extends React.Component {
  constructor(props) {
    console.log(props);
    super(props);
    this.data = props.data;
    this.userId = props.userId;
    this.employeeId = props.data.employee_id;
    this.managerId = props.data.manager_id;
  }

  /*
    Function:showUserInfo
    Parameters: event, userId
    Usage:gives info about a user
  */
  showUserInfo(event, userId){
    var self = this;
    console.log(userId);
    self.props.appContext.setState({contentDetails:self.props.appContext.loading})
    axios.get(self.props.appContext.apiBaseUrl+ 'user/' + userId,{})
    .then(function (response) {
      var shiftEditor = <UserDetails  appContext={self.props.appContext} data={response.data} userId={self.userId}/>;
      self.props.appContext.setState({contentDetails:shiftEditor})
    });
  }

  render() {
    var employeeName = 'None';
    var employeeId = '';
    if(this.data.employee && this.data.employee.name) {
      //employeeName=this.data.employee.name;
      employeeId=this.data.employee.id;
      employeeName = <a class='userInfoLink' onClick={(event)=>this.showUserInfo(event, this.data.employee.id)}>({this.data.employee.name})</a>;
    }
    var managerName = 'None';
    if(this.data.manager && this.data.manager.name) {
      managerName=this.data.manager.name;
      managerName = <a class='userInfoLink' onClick={(event)=>this.showUserInfo(event, this.data.manager.id)}>({this.data.manager.name})</a>;
    }
    if(employeeId===this.userId){ //don't show overlaps with self!
      return null;
    }
    return (
        <div className="shiftDetail">
          <div>
            Employee: {employeeName}; Manager: {managerName}
          </div>
        </div>
    );
  }
}

export default ShiftDetail;
