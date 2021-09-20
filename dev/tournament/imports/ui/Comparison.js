import React, { Component } from 'react';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import { withTracker } from 'meteor/react-meteor-data';
import { Topics, Candidates, Pairs, Users, Judgements, Experiments, Golden, Logs } from '../api/records.js';
import ReactHtmlParser from 'react-html-parser'; 


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
      leftAnswerID: '',
      ready: this.props.readyTracker,  // is MongoDB ready?
      showWarning: false,
      currentPair: '',
      yesAnswerID: '',
      noAnswerID: '',
      partiallyAnswerID: ''
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
      var leftAnswer = Candidates.findOne({'docno': currentPair['passage']})

      var currentQuestion = currentTopic['question'];
      var currentQuestionID = currentTopic['topic'];
      var leftAnswerText = leftAnswer['passage'];
      var leftAnswerID = leftAnswer['docno'];
      var yesAnswerID = "yes";
      var noAnswerID = "no";
      var partiallyAnswerID = "partially";

      // assert(currentQuestionID == rightAnswer['topicID']);
      // assert(currentQuestionID == leftAnswer['topicID']);

      this.setState({
        currentPairID: currentPair['pairID'],
        ready: this.props.readyTracker,
        question: currentQuestion,
        questionID: currentQuestionID,
        leftAnswerText: leftAnswerText,
        leftAnswerID: leftAnswerID,
        currentPair: currentPair,
        yesAnswerID: yesAnswerID,
        noAnswerID: noAnswerID,
        partiallyAnswerID: partiallyAnswerID
      });

    } else {
      // console.log("not ready");
    }
  }

  checkForWarning() {
    if ((this.state.selectedAnswerID == this.state.yesAnswerID) ||
          (this.state.selectedAnswerID == this.state.noAnswerID) ||
          (this.state.selectedAnswerID == this.state.partiallyAnswerID)) {
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
        selected: this.state.selectedAnswerID,
        workerID: this.props.workerID,
        expID: this.props.expID,
        timestamp: Date.now(),
        golden: isGolden,
        passed: this.state.currentPair['bestanswer'] == this.state.selectedAnswerID,
        bestanswer: this.state.currentPair['bestanswer'],
      });

    } else {
      Judgements.insert({
        topic: this.state.questionID,
        left: this.state.leftAnswerID,
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


  renderTopic() {

    return (
      <div className="container-fluid">
        <div className="row justify-content-between">
          <div className="col-6 question">
            Does this passage answer the question: { this.state.question }
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
    var candidateClass = "col-md-3 px-lg-5 py-3 mx-3 answerCandidate";
    
    var ASelected = (this.state.selectedAnswerID == this.state.leftAnswerID) ? " selectedCandidate " : "";    
    var yesSelected = (this.state.selectedAnswerID == this.state.yesAnswerID) ? " selectedCandidate " : "";
    var noSelected = (this.state.selectedAnswerID == this.state.noAnswerID) ? " selectedCandidate " : "";
    var partiallySelected = (this.state.selectedAnswerID == this.state.partiallyAnswerID) ? " selectedCandidate " : "";
	

	const divStyle = {
		overflowY: 'auto',
		height: 400
	};



	//console.log(this.state);
    //console.log(this.state.leftAnswerID);
    //console.log(this.state.rightAnswerID);
    return (
      <div className="container-fluid">
        <div className="row mx-lg-n5 justify-content-center" style = {{marginBottom: 15}}>
          <div className={ "col-md-5 px-lg-5 py-3 passageText" }
            name={ this.state.leftAnswerID } 
            style={divStyle}>
              { ReactHtmlParser (this.state.leftAnswerText) }
          </div>
        </div>
          
        <div className="row mx-lg-n5 justify-content-md-center-between">
          <div className={  yesSelected + candidateClass  }
            name={ this.state.yesAnswerID }
            onClick={ () => this.answerSelected("yes") }>
              Yes, the passage answers the question.
          </div>
		
          <div className={  candidateClass + partiallySelected }
            name={ this.state.partiallyAnswerID }
            onClick={ () => this.answerSelected(this.state.partiallyAnswerID) }>
              Partially, the passage provides related information.
          </div>

          <div className={  candidateClass + noSelected }
            name={ this.state.noAnswerID }
            onClick={ () => this.answerSelected("no") }>
              No, the passage does not answer the question.
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
            Please select one of three buttons.
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

    console.log(props);
    console.log(allPairs);

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
