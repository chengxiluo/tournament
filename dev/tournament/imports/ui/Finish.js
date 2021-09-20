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
          If the completion code did not load, or something else went wrong, please contact Charles Clarke at claclark@gmail.com
        </div>

        <div className="mx-auto text-center"
              style={{marginTop: '40px'}}>
          <p>
            We thank you for participating in this study.
          </p>
          
          <p>
            The objective of the study is to improve machine learning algorithms for answer selection for conversational assistants such as Amazon Alexa, Siri, etc.
          </p>
          
          <p>
            Over the course of the experiment, we recorded the answer choices you made for each answer. 
          </p>
          <p>
            The data files will be stored under a numerical identifier (e.g., P7). We will release the dataset of the labels we collect from the study for the use in future research. 
            No identifiable information or worker IDs will be released. The data files will be stored under numerical identifier. Once all the data are collected and analyzed for this project, 
            we plan on sharing this information with the research community through seminars, conferences, presentations, and journal articles.
          </p>
          <p>
            If after finishing the task you wish to withdraw the data you have provided, you can do so by contacting Charles L.A. Clarke at claclark@gmail.com. 
            You can withdraw your data up until the dataset is publicly released on February 1, 2022.
          </p>
          <p>
            This study has been reviewed and received ethics clearance through a University of Waterloo Research Ethics Committee (ORE#41912). 
            If you have questions for the Committee, contact the Office of Research Ethics, at 1-519-888-4567 ext. 36005 or oreceo@uwaterloo.ca.
          </p>
          <p>
            Should you have any questions about the study, or if you would like to obtain a copy of the findings made in this study, please contact Charles L.A. Clarke at claclark@gmail.com.
          </p>
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



