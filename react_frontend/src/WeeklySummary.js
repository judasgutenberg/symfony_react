import React, { Component } from 'react';

class WeeklySummary extends React.Component {
  constructor(props) {
    console.log(props);
    super(props);
    this.data = props.data;
    this.userId = props.userId;
  }


  render() {
    console.log(this.data);
    var report = this.data.map((x,y)=>
      <tr key={y}>
      <td>{x.year}</td><td>{x.week}</td><td>{x.total_hours}</td>
      </tr>
    )
    console.log(report);
    return (

        <div className="weeklySummary">
        <h2>Your Weekly Summary</h2>
          <table className='dataTable'>
          <thead>
          <tr>
          <th>Year</th><th>Week</th><th>Hours Assigned</th>
          </tr>
          </thead>
          <tbody>
            {report}
            </tbody>
          </table>
        </div>

    );
  }
}

export default WeeklySummary;
