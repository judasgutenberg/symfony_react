
import React, { Component } from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import axios from 'axios';
import Dashboard from './Dashboard';

class Login extends Component {
  constructor(props){
    super(props);
    var localloginComponent=[];
    localloginComponent.push(
      <MuiThemeProvider>
        <div>
         <TextField
           hintText="Your Email (You have to have given one to log in!)"
           floatingLabelText="Email"
           onChange = {(event,newValue)=>this.setState({email:newValue})}
           />
         <br/>
           <TextField
             type="password"
             hintText="Enter your Password"
             floatingLabelText="Password"
             onChange = {(event,newValue) => this.setState({password:newValue})}
             />
           <br/>
           <RaisedButton label="Login" primary={true} style={style} onClick={(event) => this.handleClick(event)}/>
       </div>
       </MuiThemeProvider>
    )
    this.state={
      email:'',
      password:'',
      menuValue:1,
      loginComponent:localloginComponent,
      loginRole:'employee'
    }
  }
  componentWillMount(){
    var localloginComponent=[];
    localloginComponent.push(
      <MuiThemeProvider key='t1'>
        <div>
         <TextField
           floatingLabelText="Email"
           onChange = {(event,newValue) => this.setState({email:newValue})}
           />
         <br/>
           <TextField
             type="password"
             hintText="Enter your Password"
             floatingLabelText="Password"
             onChange = {(event,newValue) => this.setState({password:newValue})}
             />
           <br/>
           <RaisedButton label="Login" primary={true} style={style} onClick={(event) => this.handleClick(event)}/>
       </div>
       </MuiThemeProvider>
    )
    this.setState({menuValue:1,loginComponent:localloginComponent,loginRole:'employee'})
  }

  handleClick(event){
    var self = this;
    var payload={
      "email":this.state.email,
	    "password":this.state.password,
      "role":this.state.loginRole
    }
    axios.post(self.props.appContext.apiBaseUrl+'user/login', payload)
   .then(function (response) {
     if(response.data.code === 200){
       console.log("Login successfull, userId:" + response.data.user.id);
       var contentScreen=[];
       self.props.appContext.userName = response.data.user.name;
       self.props.appContext.userId = response.data.user.id;
       self.props.appContext.role = response.data.user.role;
       //console.log(self.props.appContext.roleName );
       contentScreen.push(<Dashboard key={1} appContext={self.props.appContext} role={self.props.appContext.role} userId={response.data.user.id}/>)
       self.props.appContext.setState({loginPage:[],contentScreen:contentScreen})
     } else if(response.data.code === 204){
       console.log("Email and password do not match");
       alert(response.data.error)
     } else {
       console.log(response.data.code,"Email does not exists");
       alert("Email does not exist");
     }
   })
   .catch(function (error) {
     console.log("oops!", error);
   });
  }

  render() {
    return (
      <div>
      <h2>Login</h2>
        {this.state.loginComponent}
      </div>
    );
  }
}

const style = {
  margin: 15,
};

export default Login;
