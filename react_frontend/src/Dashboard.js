import React, { Component } from 'react';

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.userId = props.userId;
    this.role = props.role;
    this.state = {draweropen: false,currentScreen:[]};
  }

  /**
   * Toggle opening and closing of drawer
   * @param {*} event
   */
  toggleDrawer(event){
  // console.log("drawer click");
  this.setState({draweropen: !this.state.draweropen})
  }

  render() {

    return (
      <div className="App">
        <div>
          {this.state.currentScreen}
        </div>
      </div>
    );
  }
}

export default Dashboard;
