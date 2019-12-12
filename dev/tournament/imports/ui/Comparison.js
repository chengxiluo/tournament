import React, { Component } from 'react';
// import {Tasks} from '../api/tasks.js';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { withTracker } from 'meteor/react-meteor-data';
import { Topics, Candidates } from '../api/records.js';
// import { InLabExperiments, InLabLogs } from '../api/search_tasks.js';
// import { dictToURLParams, getNextPage } from '../api/Utilities.js';



class Comparison extends Component {
  constructor(props) {
    super(props);
    this.loremipsum = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.";
    this.answerSelected = this.answerSelected.bind(this);
    this.state = {
      selectedAnswerID: "",
    }
  }

  renderContinue() {
    return (
      <div>
        <button type="button" class="btn btn-lg btn-block cnt-button">
          Continue
        </button>
      </div>
    );
  }

  renderInstruction() {
    return (
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-12 instruction">
            <h1>
              Instructions:
            </h1>
            <ul>
              <li> Select the passage that answers the question better </li>
              <li> If both answers are similar, select the one with the least extaneous information</li>
              <li> If both answers still similar, select the one with the best formatting.</li>
            </ul>

          </div>
        </div>
      </div>
    );
  }

  renderTopic() {
    return (
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-12 question">
            <h1>Question:</h1>
             { this.props.questionText }
          </div>
        </div>
      </div>
      );
  }

  answerSelected(selectedAnswerID) {
    console.log('selected :: ' + selectedAnswerID);
    this.setState({
      selectedAnswerID: selectedAnswerID,
    });
  }

  renderAnswers() {
    var candidateClass = "col-md-5 px-lg-5 py-3 answerCandidate";

    var ASelected = (this.state.selectedAnswerID == this.props.answerAID) ? " selectedCandidate " : "";
    var BSelected = (this.state.selectedAnswerID == this.props.answerBID) ? " selectedCandidate " : "";

    return (
      <div className="container-fluid">
        <div className="row mx-lg-n5 justify-content-between">
          <div className={  ASelected + candidateClass }
            name={ this.props.answerAID }
            onClick={ () => this.answerSelected(this.props.answerAID) }>
            { this.loremipsum }
          </div>



          <div className={candidateClass + BSelected }
            name={ this.props.answerBID }
            onClick={ () => this.answerSelected(this.props.answerBID) }>
            { this.loremipsum }
          </div>
        </div>
      </div>
    );
  }

  render() {

    return (
      <div>
        { this.renderInstruction() }
        { this.renderTopic() }
        { this.renderAnswers() }
        { this.renderContinue() }
      </div>
    );
  }

}

export default ComparisonContainer = withTracker(() => {
  return {
    blah: "blah",
  };
})(Comparison);
