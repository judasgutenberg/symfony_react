import React, { Component } from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import AppBar from 'material-ui/AppBar';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import axios from 'axios';
import Login from './Login';


class Register extends Component {
  constructor(props){
    super(props);
    this.state={
      name:'',
      email:'',
      phone:'',
      password:''
    }
  }
  componentWillReceiveProps(nextProps){
    console.log("nextProps",nextProps);
  }


  handleClick(event,role){
    // console.log("values in register handler",role);
    var self = this;
    //To be done:check for empty values before hitting submit
    if(this.state.password2 != this.state.password) {
      alert("Passwords must match!");
    } else {


      if(this.state.name.length>0  && this.state.password.length>0){

          var payload={
          "name": this.state.name,
          "email":this.state.email,
          "phone":this.state.phone,
          "password":this.state.password,
          "role":role
          }

          axios.post(self.props.appContext.apiBaseUrl+'user/create', payload)
         .then(function (response) {
           console.log(response);
           if(response.data.code === 200){
            //  console.log("registration successfull");
             var loginscreen=[];
             loginscreen.push(<Login parentContext={this} appContext={self.props.appContext} role={role}/>);
             var loginmessage = "Not Registered yet. Go to registration";
             self.props.parentContext.setState({loginscreen:loginscreen,
             loginmessage:loginmessage,
             buttonLabel:"Register",
             isLogin:true
              });
           } else {
             console.log("some error ocurred",response.data.error);
             alert(response.data.error);
           }


       })
       .catch(function (error) {
         alert(error);
         console.log(error);

       });
      } else {
        alert("Input field value is missing");
      }

    }
  }
  render() {
    var userhintText,userLabel;

    return (
      <div>
        <MuiThemeProvider>
          <div>
          <h2>Register</h2>
           <TextField
             hintText="Enter your full name"
             floatingLabelText="Name"
             onChange = {(event,newValue) => this.setState({name:newValue})}
             />
           <br/>
           <TextField
             hintText="Phone"
             floatingLabelText="Phone"
             onChange = {(event,newValue) => this.setState({phone:newValue})}
             />
           <br/>
           <TextField
             hintText="Email"
             floatingLabelText="Email"
             onChange = {(event,newValue) => this.setState({email:newValue})}
             />
           <br/>
           <TextField
             type = "password"
             hintText="Enter your Password"
             floatingLabelText="Password"
             onChange = {(event,newValue) => this.setState({password:newValue})}
             />
           <br/>
           <TextField
            type = "password"
             hintText="Re-enter your Password"
             floatingLabelText="Password (Again)"
             onChange = {(event,newValue) => this.setState({password2:newValue})}
             />
           <br/>
           <RaisedButton label="Submit" primary={true} style={style} onClick={(event) => this.handleClick(event,this.props.role)}/>
          </div>
         </MuiThemeProvider>
      </div>
    );
  }
}

const style = {
    margin: 15,
  };

export default Register;
