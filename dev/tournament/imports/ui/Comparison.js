import React, { Component } from 'react';
// import {Tasks} from '../api/tasks.js';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { withTracker } from 'meteor/react-meteor-data';
import { Topics, Candidates, Pairs, Users, Judgements } from '../api/records.js';
// import { useBeforeunload } from 'react-beforeunload';
// import { InLabExperiments, InLabLogs } from '../api/search_tasks.js';
// import { dictToURLParams, getNextPage } from '../api/Utilities.js';



class Comparison extends Component {
  constructor(props) {
    super(props);
    this.loremipsum = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.";
    this.answerSelected = this.answerSelected.bind(this);
    this.onContinueClickHandler = this.onContinueClickHandler.bind(this);
    this.onBackClickHandler = this.onBackClickHandler.bind(this);

    this.state = {
      selectedAnswerID: '',
      displayPairIndex: 0,
      question: '',
      left: '',
      right: '',
      ready: this.props.readyTracker,
      leftID: '',
      rightID: '',
      showWarning: false,
    }
  }

  componentDidMount() {
    console.log("componentDidMount");
    window.addEventListener('beforeunload', function (e) {
      // Cancel the event
      e.preventDefault();
      // LOG TRYNG TO LEAVE THE PAGE
      // Chrome requires returnValue to be set
      e.returnValue = '';
    });
  }

  componentWillUnmount() {
    console.log("componentWillUnmount");
    window.removeEventListener("onbeforeunload", this.handleWindowBeforeUnload);
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    // this check is needed, otherwise an infinite loop of rerendering will start
    if (prevProps !== this.props) {
      console.log(this.props.allPairs);
      this.updateStateNext();
    }
  }

  updateStatePrev() {
    if (this.props.readyTracker) {
      var currentPair = this.props.allPairs[this.state.displayPairIndex];
      var oldIndex = this.state.displayPairIndex;
      console.log("Current index: " + this.state.displayPairIndex);
      console.log(currentPair);

      var currentTopic = Topics.findOne({'topic': currentPair['topic']});
      var currentQuestion = currentTopic['question'];
      var leftAnswer = Candidates.findOne({'docno': currentPair['left']})
      var rightAnswer = Candidates.findOne({'docno': currentPair['right']})

      if (leftAnswer && rightAnswer) {
        oldIndex = oldIndex - 1;
      }

      while (! (leftAnswer && rightAnswer)) {
        oldIndex = oldIndex - 1;
        currentPair = this.props.allPairs[oldIndex];
        currentTopic = Topics.findOne({'topic': currentPair['topic']});
        currentQuestion = currentTopic['question'];
        leftAnswer = Candidates.findOne({'docno': currentPair['left']})
        rightAnswer = Candidates.findOne({'docno': currentPair['right']})
      }

      var left;
      var right;
      var leftID;
      var rightID;

      if (leftAnswer && rightAnswer) {
        left = leftAnswer['passage'];
        right = rightAnswer['passage'];
        leftID = leftAnswer['docno'];
        rightID = rightAnswer['docno'];
      }

      this.setState({
        ready: this.props.readyTracker,
        displayPairIndex: oldIndex,
        question: currentQuestion,
        left: left,
        right: right,
        leftID: leftID,
        rightID: rightID,
      });
    } else {
      console.log("not ready");
    }
  }

  updateStateNext() {
    if ((this.state.selectedAnswerID == this.state.leftID) ||
          (this.state.selectedAnswerID == this.state.rightID)) {
      this.setState({
        showWarning: false,
      });
    } else {
      this.setState({
        showWarning: true,
      });
      return;
    }

    if (this.props.readyTracker) {
      var currentPair = this.props.allPairs[this.state.displayPairIndex];
      var oldIndex = this.state.displayPairIndex;
      console.log("Current index: " + this.state.displayPairIndex);
      console.log(currentPair);

      var currentTopic = Topics.findOne({'topic': currentPair['topic']});
      var currentQuestion = currentTopic['question'];
      var leftAnswer = Candidates.findOne({'docno': currentPair['left']})
      var rightAnswer = Candidates.findOne({'docno': currentPair['right']})

      if (leftAnswer && rightAnswer) {
        oldIndex = oldIndex + 1;
      }

      while (! (leftAnswer && rightAnswer)) {
        oldIndex = oldIndex + 1;
        currentPair = this.props.allPairs[oldIndex];
        currentTopic = Topics.findOne({'topic': currentPair['topic']});
        currentQuestion = currentTopic['question'];
        leftAnswer = Candidates.findOne({'docno': currentPair['left']})
        rightAnswer = Candidates.findOne({'docno': currentPair['right']})
      }

      var left;
      var right;
      var leftID;
      var rightID;

      if (leftAnswer && rightAnswer) {
        left = leftAnswer['passage'];
        right = rightAnswer['passage'];
        leftID = leftAnswer['docno'];
        rightID = rightAnswer['docno'];
      }

      this.setState({
        ready: this.props.readyTracker,
        displayPairIndex: oldIndex,
        question: currentQuestion,
        left: left,
        right: right,
        leftID: leftID,
        rightID: rightID,
      });
    } else {
      console.log("not ready");
    }
  }

  onBackClickHandler() {
    this.updateStatePrev();
  }

  onContinueClickHandler() {
    var oldIndex = this.state.displayPairIndex;
    var currentQuestion;
    var left;
    var right;
    var leftID;
    var rightID;

    if (this.props.readyTracker) {
      this.updateStateNext();
    }
  }

  renderContinue() {
    return (
      <div>
        <button type="button" className="btn btn-lg btn-block cnt-button"
        onClick={ () => this.onContinueClickHandler() }>
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
            <h2>
              Instructions:
            </h2>
            <ul>
              <li> Click on the passage that answers the question better. </li>
              <li> If both answers are similar, select the one with the least extraneous information.</li>
              <li> If both answers are still similar, select the one with the best formatting.</li>
            </ul>

          </div>
        </div>
      </div>
    );
  }

  renderTopic() {

    return (
      <div className="container-fluid">
        <div className="row justify-content-between">
          <div className="col-6 question">
            Question: { this.state.question }
          </div>

          { this.renderBackButton() }

        </div>
      </div>
      );
  }

  answerSelected(selectedAnswerID) {

    this.setState({
      selectedAnswerID: selectedAnswerID,
      showWarning: false,
    });
  }

  renderAnswers() {
    var candidateClass = "col-md-5 px-lg-5 py-3 answerCandidate";

    var ASelected = (this.state.selectedAnswerID == this.state.leftID) ? " selectedCandidate " : "";
    var BSelected = (this.state.selectedAnswerID == this.state.rightID) ? " selectedCandidate " : "";

    return (
      <div className="container-fluid">
        <div className="row mx-lg-n5 justify-content-between">
          <div className={  ASelected + candidateClass }
            name={ this.state.leftID }
            onClick={ () => this.answerSelected(this.state.leftID) }>
            { this.state.left }
          </div>



          <div className={candidateClass + BSelected }
            name={ this.state.rightID }
            onClick={ () => this.answerSelected(this.state.rightID) }>
            { this.state.right }
          </div>
        </div>
      </div>
    );
  }

  renderWarning() {
    return (
      <div className="container-fluid">
        <div className="row mx-lg-n5 justify-content-between">
          <div className="col-md-12 alert alert-danger warning text-center" role="alert">
            Please select the better of the two passages
          </div>
        </div>
      </div>
    );
  }

  renderBackButton() {
    // onClick={ () => this.onContinueClickHandler() }>

    var backButtonDisabled = (this.state.displayPairIndex == 1) ? "disabled" : "";
    if (backButtonDisabled) {
      return (
          <div className="col-6 backButton">
            <button type="button" className="btn btn-primary float-right" disabled onClick={ () => this.onBackClickHandler() }>Go Back to Previous Question</button>
          </div>
      );
    } else {
      return (
          <div className="col-6 backButton">
            <button type="button" className="btn btn-primary float-right" onClick={ () => this.onBackClickHandler() }>Go Back to Previous Question</button>
          </div>
      );
    }


  }

  render() {
    if (!this.state.ready) {
      return (
        <div className="container-fluid">
          <div className="row mx-lg-n5">
            Loading...
          </div>
        </div>
      );
    } else {
      return (
        <div>
          { this.renderInstruction() }
          { this.renderTopic() }
          { this.renderAnswers() }
          { this.state.showWarning ? this.renderWarning() : null }
          { this.renderContinue() }


        </div>
      );
    }
  }

// <Beforeunload onBeforeunload={() => "You'll lose your data!"} />
}

export default ComparisonContainer = withTracker((props) => {
  const pairsHandle = Meteor.subscribe("pairs", props);
  const candidatesHandle = Meteor.subscribe("candidates", props);
  const topicsHandle = Meteor.subscribe("topics", props);

  var ready = (pairsHandle.ready() && candidatesHandle.ready() && topicsHandle.ready());

  var allPairs;
  if (ready) {
    allPairs = Pairs.find({}).fetch();
  }

  return {
    readyTracker: ready,
    allPairs: allPairs,
  };
})(Comparison);
