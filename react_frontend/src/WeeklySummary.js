import React, { Component } from 'react';

class WeeklySummary extends React.Component {
  constructor(props) {
    console.log(props);
    super(props);
    this.data = props.data;
    this.userId = props.userId;
  }

  //let's see a friendly display of what day a week begins
  weekBegin(thisYear, week) {
    //week=2;
    //thisYear = 2020;
    var baseDate = new Date(thisYear, 0, 1 + 7*(week));
    const monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];
    var dow = baseDate.getDay();
    var month = baseDate.getMonth();
    var day = baseDate.getDate();
    if(dow<4){
      day = day - dow;
    } else {
      day = day + 8 - dow + 1;
    }
    return monthNames[month] + ' ' + day;
  }

  render() {
    console.log(this.data);
    var report = this.data.map((x,y)=>
      <tr key={y}>
      <td>{x.year}</td><td>{this.weekBegin(x.year,x.week)}</td><td>{x.total_hours}</td>
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
