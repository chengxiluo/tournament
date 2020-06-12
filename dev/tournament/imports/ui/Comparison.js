import React, { Component } from 'react';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { withTracker } from 'meteor/react-meteor-data';
import { Topics, Candidates, Pairs, Users, Judgements, Experiments, Golden, Logs } from '../api/records.js';


class Comparison extends Component {
  constructor(props) {
    super(props);

    this.answerSelected = this.answerSelected.bind(this);
    this.onContinueClickHandler = this.onContinueClickHandler.bind(this);
    this.onBackClickHandler = this.onBackClickHandler.bind(this);

    this.state = {
      currentPairID: '',
      selectedAnswerID: '',
      displayPairIndex: 0,
      question: '',
      questionID: '',
      leftAnswerText: '',
      rightAnswerText: '',
      leftAnswerID: '',
      rightAnswerID: '',
      ready: this.props.readyTracker,  // is MongoDB ready?
      showWarning: false,
      currentPair: '',
    }
  }

  componentDidMount() {
    window.addEventListener('beforeunload', function (e) {
      e.preventDefault();
      e.returnValue = '';
    });
  }

  componentWillUnmount() {
    window.removeEventListener("onbeforeunload", this.handleWindowBeforeUnload);
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevProps !== this.props) {
      this.updateAnswers();
    }
  }

  updateAnswers() {
    if (this.props.readyTracker) {

      // contains topic (topicID), left (answerID), right (answerID)
      var currentPair = this.props.allPairs[this.state.displayPairIndex];

      // contains topic (topicID), question (question text), bestanswer (answerID)
      var currentTopic = Topics.findOne({'topic': currentPair['topic']});

      // contains docno (answerID), passage (answer text), topic (topicID)
      // console.log(currentPair);
      var leftAnswer = Candidates.findOne({'docno': currentPair['left']})
      var rightAnswer = Candidates.findOne({'docno': currentPair['right']});

      var currentQuestion = currentTopic['question'];
      var currentQuestionID = currentTopic['topic'];
      var leftAnswerText = leftAnswer['passage'];
      var rightAnswerText = rightAnswer['passage'];
      var leftAnswerID = leftAnswer['docno'];
      var rightAnswerID = rightAnswer['docno'];

      // assert(currentQuestionID == rightAnswer['topicID']);
      // assert(currentQuestionID == leftAnswer['topicID']);

      this.setState({
        currentPairID: currentPair['pairID'],
        ready: this.props.readyTracker,
        question: currentQuestion,
        questionID: currentQuestionID,
        leftAnswerText: leftAnswerText,
        rightAnswerText: rightAnswerText,
        leftAnswerID: leftAnswerID,
        rightAnswerID: rightAnswerID,
        currentPair: currentPair,
      });

    } else {
      // console.log("not ready");
    }
  }

  checkForWarning() {
    if ((this.state.selectedAnswerID == this.state.leftAnswerID) ||
          (this.state.selectedAnswerID == this.state.rightAnswerID)) {
      this.setState({
        showWarning: false,
      });
      return false;
    } else {
      this.setState({
        showWarning: true,
      });
      return true;
    }
  }

  onBackClickHandler() {
    var oldIndex = this.state.displayPairIndex;
    var prevIndex = oldIndex - 1;

    // set state is asynchronious, calling updateAnswers as a callback
    this.setState({
      displayPairIndex: prevIndex,
    }, this.updateAnswers);
  }

  onExitClickHandler() {

    var currentPayment = (this.state.displayPairIndex * 10 + 10)/100

    var exit = window.confirm("Are you sure you want to exit this HIT?\nYour payment is will be $" + currentPayment)
    if (exit) {
      FlowRouter.go("/Finish/" + this.props.expID + "?workerID=" + this.props.workerID);
    }

    console.log("Exiting task")
  }

  onContinueClickHandler() {
    var warning = this.checkForWarning();
    if (warning) {
      Logs.insert({
        workerID: this.props.workerID,
        expID: this.props.expID,
        action: 'continue with no selected answer',
        timestamp: Date.now(),
      });
      return;
    }

    var isGolden = this.state.currentPair['golden'];
    if (isGolden) {
      Judgements.insert({
        topic: this.state.questionID,
        left: this.state.leftAnswerID,
        right: this.state.rightAnswerID,
        selected: this.state.selectedAnswerID,
        workerID: this.props.workerID,
        expID: this.props.expID,
        timestamp: Date.now(),
        golden: isGolden,
        bestanswer: this.state.currentPair['bestanswer'],
        altanswer: this.state.currentPair['altanswer'],
      });

    } else {
      Judgements.insert({
        topic: this.state.questionID,
        left: this.state.leftAnswerID,
        right: this.state.rightAnswerID,
        selected: this.state.selectedAnswerID,
        workerID: this.props.workerID,
        expID: this.props.expID,
        timestamp: Date.now(),
        golden: isGolden,
      });
    }



    Logs.insert({
      workerID: this.props.workerID,
      expID: this.props.expID,
      action: 'selected answer',
      timestamp: Date.now(),
    });

    var oldPairIndex = this.state.displayPairIndex;
    var nextIndex = oldPairIndex + 1;
    if (nextIndex >= this.props.allPairs.length) {
      // this was the last pair of the experiment
      // finish the experiment
      Logs.insert({
        workerID: this.props.workerID,
        expID: this.props.expID,
        action: 'navigate to finish',
        timestamp: Date.now(),
      });

      FlowRouter.go("/Finish/" + this.props.expID + "?workerID=" + this.props.workerID);


    } else {
      // set state is asynchronious, calling updateAnswers as a callback
      this.setState({
        displayPairIndex: nextIndex,
        selectedAnswerID: '',
      }, this.updateAnswers);

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

    var ASelected = (this.state.selectedAnswerID == this.state.leftAnswerID) ? " selectedCandidate " : "";
    var BSelected = (this.state.selectedAnswerID == this.state.rightAnswerID) ? " selectedCandidate " : "";
    console.log(this.state.leftAnswerID);
    console.log(this.state.rightAnswerID);
    return (
      <div className="container-fluid">
        <div className="row mx-lg-n5 justify-content-between">
          <div className={  ASelected + candidateClass }
            name={ this.state.leftAnswerID }
            onClick={ () => this.answerSelected(this.state.leftAnswerID) }>
            { this.state.leftAnswerText }
          </div>

          <div className={candidateClass + BSelected }
            name={ this.state.rightAnswerID }
            onClick={ () => this.answerSelected(this.state.rightAnswerID) }>
            { this.state.rightAnswerText }
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
    var backButtonDisabled = (this.state.displayPairIndex == 0) ? "disabled" : "";
    if (backButtonDisabled) {
      return (
        <div className="col-6">
          <div className="row justify-content-end">

            <div className="col-6 backButton">
              <button type="button" className="btn btn-primary btn-block" disabled onClick={ () => this.onBackClickHandler() }>Go Back to Previous Question</button>
            </div>

            <div className="col-3 exitButton">
              <button type="button" className="btn btn-danger float-right btn-block" onClick={ () => this.onExitClickHandler() }>Exit task</button>
            </div>

          </div>
        </div>
      );
    } else {
      return (
          <div className="col-6">
            <div className="row justify-content-end">
              <div className="col-6 backButton">
                <button type="button" className="btn btn-primary btn-block" onClick={ () => this.onBackClickHandler() }>Go Back to Previous Question</button>
              </div>

              <div className="col-3 exitButton">
                <button type="button" className="btn btn-danger float-right btn-block" onClick={ () => this.onExitClickHandler() }>Exit task</button>
              </div>
            </div>
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

}

export default ComparisonContainer = withTracker((props) => {
  const pairsHandle = Meteor.subscribe("pairs", props);
  const candidatesHandle = Meteor.subscribe("candidates", props);
  const topicsHandle = Meteor.subscribe("topics", props);
  const experimentsHandle = Meteor.subscribe("experiments", props);

  var ready = (pairsHandle.ready() && candidatesHandle.ready() && topicsHandle.ready() && experimentsHandle.ready());

  var allPairs;
  var expID;
  var workerID;

  if (ready) {
    expID = props.expID;
    workerID = props.workerID;
    allPairs = Experiments.findOne({'expID': expID}); // .fetch();
    allPairs = allPairs['pairs'];
    // shuffle the order of the pairs
    var m = allPairs.length, t, i;
    // While there remain elements to shuffle…
    while (m) {
      // Pick a remaining element…
      i = Math.floor(Math.random() * m--);
      // And swap it with the current element.
      t = allPairs[m];
      allPairs[m] = allPairs[i];
      allPairs[i] = t;
    }
  }




  return {
    readyTracker: ready,
    allPairs: allPairs,
    expID: expID,
    workerID: workerID,
    displayPairIndexProp: 0,
  };
})(Comparison);


// const shuffle = (array) => {
//   var m = array.length, t, i;
//   // While there remain elements to shuffle…
//   while (m) {
//     // Pick a remaining element…
//     i = Math.floor(Math.random() * m--);

//     // And swap it with the current element.
//     t = array[m];
//     array[m] = array[i];
//     array[i] = t;
//   }
//   return array;
// }
