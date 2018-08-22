import React, { Component } from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import axios from 'axios';
import TextField from 'material-ui/TextField';
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';
import DateTimePicker from 'react-datetime-picker';

class ShiftEditor extends React.Component {

  constructor(props) {
    console.log(props);
    super(props);
    this.data = props.data;
    this.shiftSaved  = <div className='message'>Shift Saved!</div>;
    this.userId = props.userId;
    if(this.data.shift){
      this.state={
        manager_id:this.data.shift.manager_id,
        employee_id:this.data.shift.employee_id,
        start_time:this.data.shift.start_time,
        end_time:this.data.shift.end_time,
        break:this.data.shift.break
      }
    } else {
      this.state={
        manager_id:'',
        employee_id:'',
        start_time:new Date(),
        end_time:new Date(),
        break:''
      }
    }
  }

  displayShiftData(response) {
      console.log(response);
      if(response.data.code === 200){
       console.log("Shift saved!");
       this.props.appContext.setState({contentDetails:this.shiftSaved})
       this.props.appContext.setState({loginPage:[],contentScreen:[]});
      } else {
        console.log("some error ocurred",response.data.error);
        alert(response.data.error);
      }
    }

    saveShift(event){
      var butttonLabel = "My Shifts";
      if(this.role=='manager') {
        butttonLabel = "Shift Browser";
      }

      var self = this;
      console.log(this.state)
      var managerId = this.state.manager_id;
      var employee_id = this.state.employee_id;
      //the backend does not like to get '' -- it wants null
      if(managerId == '') {
        managerId = null;
      }
      if(employee_id == '') {
        employee_id = null;
      }
      var payload={
        "manager_id": managerId,
        "employee_id":employee_id,
        //value = {new Date(this.state.start_time).toString().split(' GMT')[0]}
        "start_time":this.state.start_time,
        "end_time":this.state.end_time,
        "break":this.state.break,
      }

      var restMethod = 'POST';
      var fullUrl = this.props.appContext.apiBaseUrl+'shift/save';
      if(this.data.shift && this.data.shift.id){
        fullUrl+="/"+ this.data.shift.id
        restMethod = 'PUT';
      }
      console.log(payload);

    if(restMethod == 'PUT') {
        //i wish axios let me pass in push or post as a parameter instead of making me make two code blocks
        axios.put(fullUrl, payload)
       .then(function (response) {
         console.log(response);
         self.displayShiftData(response);
       })
      .catch(function (error) {
        console.log(error);
      });

    } else {
      console.log(payload);
      axios.post(fullUrl, payload)
       .then(function (response) {
          self.displayShiftData(response);
      })
      .catch(function (error) {
        console.log(error);
      });
    }
  }

  //makes the date as simple as possible for editing
  showDateInForm(dateStringIn) {
    var out = dateStringIn.split('+')[0].replace('T', ' ');
    if(out.length>19) {
      out = out.substr(0,19);
    }
    return out;
  }

  dropdownChange(event, value, type){
    //value is coming in as the ordinal of the option in the dropdown, so i have to do a lookup!
    var dataArray = this.data.employees;
    if(type=='manager') {
      dataArray = this.data.managers
    }
    var foundValue = null;
    for(var i=0; i<dataArray.length; i++) {
      if(i+1==value) { //have to add one because of the empty "option" at the beginning of the dropdown
          console.log(dataArray[i].name);
          foundValue = dataArray[i].id;
          break;
      }
    }
    if(value=='null') {
      foundValue = null;
    }
    if(type=='manager') {
      this.setState({manager_id:foundValue});
    } else {

      this.setState({employee_id:foundValue});
    }
  }
  dropdownChange = this.dropdownChange.bind(this)

  render() {
    const style = {
      margin: 15,
    };
    console.log(this.state);
    var manager_id = this.state.manager_id;
    if(!manager_id) {
      this.state.manager_id = this.userId;
    }

    return (
        //the mix of different sources of inputs made this easiest to format as a classic html table
        <div className="shiftEditor">
        <h2>Shift Editor</h2>
        <MuiThemeProvider>
          <table>
            <tr className='labledFormRow'>
             <td className='formLabel'>Manager</td>
             <td className='formInput'>
            <DropDownMenu className='userDropdown'  value={this.state.manager_id} onChange={(event,newValue) => {this.dropdownChange(event, newValue, 'manager')}}>
              <MenuItem value={null} key='none' primaryText='none' />
              {this.data.managers.map((x,y)=><MenuItem key={'key'+y} value={x.id} primaryText={x.name} />)}
            </DropDownMenu>
            </td>
          </tr>
          <tr className='labledFormRow'>
           <td className='formLabel'>Employee</td>
           <td className='formInput'>
           <DropDownMenu className='userDropdown'  value={this.state.employee_id} onChange={(event,newValue) => {this.dropdownChange(event, newValue, 'employee')}}>
              <MenuItem value={null} key='none' primaryText='none' />
             {this.data.employees.map((x,y)=><MenuItem key={'key'+y} value={x.id} primaryText={x.name} />)}
           </DropDownMenu>
           </td>
           </tr>
           <tr className='labledFormRow'>
            <td className='formLabel'>Break</td>
            <td className='formInput'>
             <TextField
              className = 'breakInput'
               hintText="I'm not really clear what break is and why it's a float!"
               value = {this.state.break}
               onChange = {(event,newValue) => this.setState({break:newValue})}
               />
            </td>
            </tr>
           <tr className='labledFormRow'>
           <td className='formLabel'>Start Time</td>
           <td className='formInput'>
             <DateTimePicker
               className = 'dateTimePicker'
               value = {new Date(this.state.start_time)}
               onChange = {(value) => this.setState({start_time:value})}
               />

           </td>
           </tr>
           <tr className='labledFormRow'>
           <td className='formLabel'>End Time</td>
           <td className='formInput'>
             <DateTimePicker
             className = 'dateTimePicker'
             value = {new Date(this.state.end_time)}
             onChange = {(value) => this.setState({end_time:value})}
             />
           </td>
           </tr>
           <tr colspan='2'>
           <td>
            <RaisedButton label="Save Shift" primary={true} style={style} onClick={(event) => this.saveShift(event)}/>
           </td>
           </tr>
          </table>
         </MuiThemeProvider>
        </div>
    );
  }
}

export default ShiftEditor;
