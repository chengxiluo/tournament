import React, { Component } from 'react';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { withTracker } from 'meteor/react-meteor-data';
import { Topics, Candidates, Pairs, Users, Judgements, Experiments, Golden, Logs, Popularity } from '../api/records.js';
import ReactHtmlParser from 'react-html-parser'; 

class Comparison extends Component {
  constructor(props) {
    super(props);

    this.answerSelected = this.answerSelected.bind(this);
    this.onContinueClickHandler = this.onContinueClickHandler.bind(this);
    this.state = {
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
      init: false,
      pairsDict: {},
      currentQueue:[],
      topNRank:[],
      isGolden: false,
      goldenPairs: [],
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
		
      // 如果state没有初始化，就初始化state
      if (!this.state.init){
        this.setState({
          init : true,
          pairsDict : this.props.pairsDict,
          currentQueue: this.props.currentQueue,
          goldenPairs: this.props.goldenPairs,
          });
        var currentPair = {'left':this.props.currentQueue[0], 'right':this.props.currentQueue[1],};			
      }
      else{
        var currentPair = this.state.currentPair;
      }
		

      var currentTopic = Topics.findOne({'topic': this.props.allPairs[0]['topic']});

      var leftAnswer = Candidates.findOne({'docno': currentPair['left']})
      var rightAnswer = Candidates.findOne({'docno': currentPair['right']});
     // console.log("Answer fetching complete");

      var currentQuestion = currentTopic['question'];
      var currentQuestionID = currentTopic['topic'];
     // console.log("currentQuestion fetching complete");

      var leftAnswerText = leftAnswer['passage'];
      var rightAnswerText = rightAnswer['passage'];
      var leftAnswerID = leftAnswer['docno'];
      var rightAnswerID = rightAnswer['docno'];
    //  console.log("Answer ID fetching complete");

      this.setState({
        ready: this.props.readyTracker,
        question: currentQuestion,
        questionID: currentQuestionID,
        leftAnswerText: leftAnswerText,
        rightAnswerText: rightAnswerText,
        leftAnswerID: leftAnswerID,
        rightAnswerID: rightAnswerID,
        currentPair: currentPair,
      });
      //console.log(this.props);
	  //console.log(this.state);

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



  onExitClickHandler() {

    var currentPayment = (this.state.displayPairIndex * 10 + 10)/100

    var exit = window.confirm("Are you sure you want to exit this HIT?\nYour payment is will be $0.")
    if (exit) {
      Logs.insert({
        workerID: this.props.workerID,
        expID: this.props.expID,
        action: 'exit task',
        timestamp: Date.now(),
      });
      
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


    Logs.insert({
      workerID: this.props.workerID,
      expID: this.props.expID,
      action: 'selected answer',
      timestamp: Date.now(),
    });
    
    const TOP_K = 5
	
    var currentPair = this.state.currentPair;
    var currentQueue = this.state.currentQueue;
    var pairsDict = this.state.pairsDict;
    var topNRank = this.state.topNRank;
    var goldenPairs = this.state.goldenPairs;
    
    var isGolden = this.state.isGolden;
        
        
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
        bestanswer: currentPair['bestanswer'],
        altanswer: currentPair['altanswer'],
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
      
      if (this.state.selectedAnswerID === this.state.leftAnswerID){
        pairsDict[this.state.leftAnswerID].push(this.state.rightAnswerID);
        
      } else {
        pairsDict[this.state.rightAnswerID].push(this.state.leftAnswerID);           
      }
      currentQueue.shift();
      currentQueue.shift();
      currentQueue.push(this.state.selectedAnswerID); 

      if (currentQueue.length == 1 && goldenPairs.length > 0) {
        currentPair = goldenPairs.pop()
        this.setState({
          isGolden: true,
          currentPair: currentPair,
          selectedAnswerID: '',
        }, this.updateAnswers);
        return ;
      }      
    }
    

    
    
    while (currentQueue.length <= 1){
      topNRank.push(currentQueue[0]);
      currentQueue = pairsDict[currentQueue[0]].slice();
      
      if (currentQueue.length == 0){
        topNRank.push(currentQueue[0]);
      }
      
      if (topNRank.length >= TOP_K){
       Logs.insert({
        workerID: this.props.workerID,
        expID: this.props.expID,
        action: 'navigate to finish',
        timestamp: Date.now(),
        });
        
        Popularity.insert({
          workerID: this.props.workerID,
          expID: this.props.expID,           
          topic: this.state.questionID,
          topK: topNRank,
          timestamp: Date.now(),
        }); 
        
        FlowRouter.go("/Finish/" + this.props.expID + "?workerID=" + this.props.workerID);
        return;
      }         
    }

    currentPair = {'left':currentQueue[0], 'right':currentQueue[1],};	
    
    this.setState({
      isGolden : false,
      currentPair: currentPair,
      currentQueue: currentQueue,
      selectedAnswerID: '',
    }, this.updateAnswers);
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
	

	const divStyle = {
		overflowY: 'auto',
		height: 400
	};
	
	//console.log(this.state);
    //console.log(this.state.leftAnswerID);
    //console.log(this.state.rightAnswerID);
    return (
      <div className="container-fluid">
	  
        <div className="row mx-lg-n5 justify-content-between">
          <div className={  ASelected + candidateClass }
            name={ this.state.leftAnswerID }
            onClick={ () => this.answerSelected(this.state.leftAnswerID) } 
			style={divStyle}>

			{ ReactHtmlParser (this.state.leftAnswerText) }

		  </div>
		
          <div className={candidateClass + BSelected }
            name={ this.state.rightAnswerID }
            onClick={ () => this.answerSelected(this.state.rightAnswerID) }
			style = {divStyle}>
			{ ReactHtmlParser (this.state.rightAnswerText) }

		  
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
  console.log("Subscribing");
  const pairsHandle = Meteor.subscribe("pairs", props);
  const candidatesHandle = Meteor.subscribe("candidates", props);
  const topicsHandle = Meteor.subscribe("topics", props);
  const experimentsHandle = Meteor.subscribe("experiments", props);
  const popularityHandle = Meteor.subscribe("popularity", props);

  console.log("paisHandle ready:",pairsHandle.ready());
  console.log("candidatesHandle ready:",candidatesHandle.ready());
  console.log("topicsHandle ready:",topicsHandle.ready());
  console.log("experimentsHandle ready:",experimentsHandle.ready());
  console.log("popularityHandle ready:",popularityHandle.ready());
  var ready = (pairsHandle.ready() && candidatesHandle.ready() && topicsHandle.ready() && experimentsHandle.ready() && popularityHandle.ready());
  var allPairs;
  var expID;
  var workerID;
  var pairsDict;
  var currentQueue;
  var goldenPairs;
  //var stage = 0;

  if (ready) {
	console.log("Subscribing done");
	console.log("Starting fetching All Pairs ID complete");
    expID = props.expID;
    workerID = props.workerID;
	
	//const experimentsHandle = Meteor.subscribe("experimentsByID", expID)
	//if (experimentsHandle.ready())
	//{		
		allPairs = Experiments.findOne({'expID': expID}); // .fetch();
		allPairs = allPairs['pairs'];
		console.log("All Pairs Struct Fetching Complete");
		console.log(allPairs);
		
		//var candiateArray = []
		//allPairs.forEach((item, index) => 
		//{
		//	candiateArray.push(item['left']);
		//	candiateArray.push(item['right']);
		//})
		
		//console.log(candiateArray)
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
    

    goldenPairs = [];
    currentQueue = [];
    pairsDict = {};
		for (i = 0; i < allPairs.length; i++){
      if (allPairs[i].golden == true) {
        goldenPairs.push(allPairs[i]);
      } 
      else {
        if (allPairs[i].left != null){
          if (allPairs[i].right == null) {
            pairsDict[allPairs[i].left] = [];
            currentQueue.push(allPairs[i].left);
          } else {
            pairsDict[allPairs[i].left] = [];
            pairsDict[allPairs[i].right] = [];
            currentQueue.push(allPairs[i].left);
            currentQueue.push(allPairs[i].right);
          }
        }
      }
		}
    console.log(currentQueue);
    //}
  }




  return {
    readyTracker: ready,
    allPairs: allPairs,
    expID: expID,
    workerID: workerID,
    displayPairIndexProp: 0,
    pairsDict: pairsDict,
    currentQueue: currentQueue,
    goldenPairs: goldenPairs,
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
