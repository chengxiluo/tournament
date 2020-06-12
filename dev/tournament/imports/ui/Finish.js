import React, { Component } from 'react';
import { CompletionCodes, Logs } from '../api/records.js';
import { withTracker } from 'meteor/react-meteor-data';
import { randomAlphanumericString } from '../api/Utilities.js';


class Finish extends Component {
  constructor(props) {
    super(props);

    Logs.insert({
      action: 'loaded finish page',
      timestamp: Date.now(), // current time
      workerID: this.props.workerID,
      expID: this.props.expID,
    });
  }

  render(){
    return(
      <div className="container"
            style={{marginTop: "40px"}}>

        <div className="mx-auto text-center">
          <h2>Copy and paste your completion code to Mechanical Turk</h2>
        </div>

        <div className="row">
          <div className="col-4 rounded border border-secondary mx-auto"
                style={{backgroundColor: 'rgba(160, 160, 160, 0.7)', textAlign: 'center'}}>
                <p className="text-center align-middle"
                  style={{padding: '10px', textAlign: 'center'}}>
                  { this.props.completionCode }
                </p>
          </div>
        </div>

        <div className="mx-auto text-center"
              style={{marginTop: '40px'}}>
          <h2>Thank you for your time and effort!</h2>
        </div>

        <div className="mx-auto text-center"
              style={{marginTop: '40px'}}>
          If the completion code did not load, or something else went wrong, please contact Sasha Vtyurina at sasha.vtyurina@uwaterloo.ca
        </div>

      </div>
    );
  }
}

export default withTracker((props) => {
  const completionCodesHandler = Meteor.subscribe("completionCodes", props);
  const logsHandler = Meteor.subscribe("logs", props);
  const ready = completionCodesHandler.ready();

  var completionCode = "Loading completion code...";

  if (ready) {
    var existingCode = CompletionCodes.find({"expID": props.expID, "workerID": props.workerID}).fetch();

    if (existingCode.length > 0) {
      // console.log("confirmation code exists");
      completionCode = existingCode[0].completionCode;

      // CompletionCodes.insert({
      //   expID: props.expID,
      //   workerID: props.workerID,
      //   completionCode: completionCode,
      //   timestamp: Date.now(),
      //   action: 'fetched existing completion code',
      // });
    } else {
      // console.log("no confirmation code found");

      completionCode = randomAlphanumericString(20, 'ABCDEFGHIJKLMNOPQRSTUVWXYZ');

      CompletionCodes.insert({
        expID: props.expID,
        workerID: props.workerID,
        completionCode: completionCode,
        timestamp: Date.now(),
        action: 'created completion code',
      });
    }
  }

  return {
    completionCode: completionCode,
  };
})(Finish)



