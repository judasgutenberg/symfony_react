import React from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import axios from 'axios';
import DatePicker from 'react-date-picker';
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
    Function:cleanupDate(dateString)
    Parameters: dateString
    Usage:takes a messy javascript date and makes it usable by the backend
  */
  cleanupDate(dateString){
    var jsDate = new Date(dateString);
    var month = jsDate.getMonth() + 1;
    var year = jsDate.getFullYear();
    var day = jsDate.getDate();
    return year + '-' + month + '-' + day;
  }

  /*
    Function:narrowDateRange
    Parameters: event
    Usage:uses the date range to narrow the returned schedule data
  */
  narrowDateRange(event) {
      console.log("showUserShifts",this.userId);
      var self = this;
      self.props.appContext.setState({contentScreen:self.props.appContext.loading});
      var start_time = this.cleanupDate(this.state.start_time);
      var end_time = this.cleanupDate(this.state.end_time);
      axios.get(self.props.appContext.apiBaseUrl+'shift/range/' + start_time + '/' +  end_time, {})
     .then(function (response) {
       console.log(response);
       if(response.data.length>0){
         var shiftListLabel = "Shift List";
          let shiftList=[];
          shiftList.push(<h2>{shiftListLabel}</h2>);
          //iterate through your shifts and display a Shift Module for each one
          for(var i=0; i<response.data.length; i++){
            shiftList.push(<Shift key={i} parentContext={self.props.appContex} appContext={self.props.appContext} data={response.data[i]}  roleName='manager' userId={self.userId}/>);

          }
          self.props.appContext.setState({loginPage:[],contentScreen:shiftList})
       } else {
         var message = <div className='message'>No shifts were found.</div>
         self.props.appContext.setState({loginPage:[],contentScreen:message})
       }
    })
      .catch(function (error) {
       alert(error);
       console.log(error);
      });
  }


  render() {
    const style = {
      margin: 15,
    };
    return (
        <div className="shiftEditor">
        <h2>View Shifts In A Date Range</h2>
        <MuiThemeProvider>
          <table>
          <tr className='labledFormRow'>
          <td className='formLabel'>Start Date</td>
          <td className='formInput'>
            <DatePicker
              className = 'dateTimePicker'
              value = {new Date(this.state.start_time)}
              onChange = {(value) => this.setState({start_time:value})}
              />
          </td>
          </tr>
          <tr className='labledFormRow'>
          <td className='formLabel'>End Date</td>
          <td className='formInput'>
            <DatePicker
            className = 'dateTimePicker'
            value = {new Date(this.state.end_time)}
            onChange = {(value) => this.setState({end_time:value})}
            />
          </td>
          </tr>
          <tr colspan='2'>
          <td>
           <RaisedButton label="Show" primary={true} style={style} onClick={(event) => this.narrowDateRange(event)}/>
          </td>
          </tr>
         </table>
         </MuiThemeProvider>
         </div>
    );
  }
}

export default ShiftBrowseForm;
