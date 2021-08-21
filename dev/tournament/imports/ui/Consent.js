import React, { Component } from 'react';

import { FlowRouter } from 'meteor/kadira:flow-router';
import { withTracker } from 'meteor/react-meteor-data';
import { Logs } from '../api/records.js';

class Consent extends Component {
  constructor(props) {
    super(props);
    // this.onContinueClickHandler = this.onContinueClickHandler.bind(this);
    // this.onQuitClickHandler = this.onQuitClickHandler.bind(this);
    this.state = {workerID:''};
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({workerID: event.target.value});
  }

  handleSubmit(event) {
    alert('Your worker ID was submitted: ' + this.state.workerID);
    event.preventDefault();
  }



  render1() {
    return (
      <div>
      hello world
      </div>
    );
  }

  render() {
    return (
      <div>
        <div className="container">
          <div className="row consent">
            <h1> Preference Judgements for Conversational Assistance. </h1>
            <h2>Consent form.</h2>
          </div>

          <div className="row consent">
          <p>
            This study is conducted by Dr. Charles L.A. Clarke and Sasha Vtyurina, a PhD student,
            at the School of Computer Science of the University of Waterloo, Canada.
          </p>
          </div>

          <div className="row consent">
          <p>
            The objective of the study is to improve machine learning algorithms for
            answer selection for conversational assistants such as Amazon Alexa, Siri, etc.
          </p>
          </div>

          <div className="row consent">
            <p><b>Study details. </b>If you decide to participate, you will see a
            question with two possible answers. You want to choose the answer that
            is best for answering the question. For example, below you can see a
            question “How was the Neverending Story film received?” The answer on
            the left contains information about the critics’ response, while the
            answer on the right talk about the plot of the film. Therefore the answer
            on the left is better for suited for the question.</p>
          </div>

          <div className="row consent">
           <img src="https://tournament2020.s3.us-east-2.amazonaws.com/example.png"
           alt="Interface example" className="consentImage"/>

          </div>


          <div className="row consent">
            <p>
            This is not a test of your abilities. We want to know what <b>you </b>
             think the best answer is. If you asked Siri or Alexa this question,
             which answer would you prefer to hear? Below are the instructions
             for selecting the best answer:
            </p>


            <br/>
            <ul>
              <li>(1) Click on the answer that answers the question better. </li>
              <li>(2) If both answers are similar, select the one with the least extraneous information. </li>
              <li>(3) If both answers are similar, select the one with the best formatting (typos, punctuation, etc.) </li>
            </ul>

            <p>
            Each HIT contains 13 questions and takes around 10-12 minutes to complete.
            After completing all questions, you will be taken to a page with a confirmation code.
            Use this code to complete the HIT on the Amazon Mechanical Turk platform.
            </p>
          </div>



          <div className="row consent">
           <p> <b>Remuneration.</b> For the participation in the study you will be
            paid USD 2 per HIT. You may choose to withdraw from the task at
            any point by clicking the “Exit task” button in the top right corner
            of the screen. “Exit task” button will take you to the screen with MTurk code.
            You will get remunerated ¢10 for starting the HIT, ¢10 for each completed
            search task, and ¢60 for finishing the entire HIT.</p>
          </div>

          <div className="row consent">
            <p> <b>Inclusion/exclusion criteria</b>. We seek participants who are proficient in English.</p>
          </div>

          <div className="row consent">
            <p><b>Withdrawal.</b> Participation in this study is voluntary.
            You may decline to interact with the interface or decline to answer
            any questions in the questionnaire at any time you want. If after finishing
            the task you wish to withdraw the data you have provided, you can do so by
            contacting Charles L.A. Clarke at claclark@gmail.com or Sasha Vtyurina at
            sasha.vtyurina@uwaterloo.ca. You may withdraw your data up until the
            dataset is released publicly on May 15, 2020.</p>
          </div>

          <div className="row consent">
            <p><b>Benefits. </b>There are no direct anticipated or known benefits
             to you as a result of this study. This study will contribute to
             the development of machine learning models for answer selection in
             conversational systems such as Amazon Alexa, Siri, etc.
             </p>
          </div>


          <div className="row consent">
            <p><b>Risks. </b> We do not anticipate any risks from participation in this study.</p>
          </div>



          <div className="row consent">
            <p><b>Confidentiality.</b> It is important for you to know that any information
             that you provide will be confidential. We will be collecting your Worker
              ID but we won't publish or share it in any way. We will store it securely
               for a minimum of 7 years. We will not be collecting any other identifiable data.
                Instead, we will be recording your choices for which answers are best. Your
              choices will contribute to the dataset as a whole, and no one will know your
              individual answers except the researchers. The dataset as a whole will be publicly
              shared as part of the wider research project that aims to improve conversational
              systems.
            </p>
          </div>


          <div className="row consent">
            <p>This study has been reviewed and received ethics clearance through a
             University of Waterloo Research Ethics Committee (ORE#41912).
             If you have questions for the Committee contact the Office of
              Research Ethics, at 1-519-888-4567 ext. 36005 or ore-ceo@uwaterloo.ca.
            </p>
          </div>

          <div className="row consent">
            <p>
            <b>Questions.</b>

             Should you have any questions about the study, please contact
             Charles L.A. Clarke (claclark@gmail.com) or Sasha Vtyurina
             (sasha.vtyurina@uwaterloo.ca). Further, if you would like to
             receive a copy of the results of this study, please contact either investigator.
             </p>
          </div>



          <div className="row consent">
            <p><b>Consent for Participation. </b>By providing your consent, you are not waiving your
             legal rights or releasing the investigator(s) or
              involved institution(s) from their legal and professional responsibilities.
              With full knowledge of all foregoing, I agree, of my own free will, to participate in this study.
            </p>
          </div>

          <div className="row consent">
            <div className="col">
              <button
              //onClick={ () => this.onContinueClickHandler() }
              type="button"
              className="btn btn-success btn-lg" data-toggle="modal" data-target="#myModal">
            > I agree. Continue to experiment. </button>
            </div>

            <div class="modal fade" id="myModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel">
              <div class="modal-dialog modal-lg modal-dialog-scrollable" role="document">
                <div class="modal-content">

                  <div class="modal-body">
                    Please provide your workerID so that we can verify your answers and give you reward.
                    <form>
                      <label>
                        Your Worker ID:
                        <input type="text" value={this.state.workerID} onChange={this.handleChange} />
                      </label>
                    </form>
                  </div>

                  <div class="modal-footer">
                    <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
                    <button type="submit" class="btn btn-primary" data-dismiss="modal" onClick={ () => this.onContinueClickHandler()}>Continue</button>
                  </div>

                </div>
              </div>
            </div>

            <div className="col">
              <button
                onClick={ () => this.onQuitClickHandler() }
                type="button"
                className="btn btn-danger btn-lg"
                > I do not agree. Exit experiment. </button>
            </div>
          </div>
      </div>
        </div>
    );
  }

  onQuitClickHandler(){
    Logs.insert({
        workerID: this.state.workerID,
        expID: this.props.expID,
        action: 'consent rejected',
        timestamp: Date.now(),
      });
    FlowRouter.go("/Finish/" + this.props.expID + "?workerID=" + this.state.workerID);
  }

  onContinueClickHandler(){
    Logs.insert({
        workerID: this.state.workerID,
        expID: this.props.expID,
        action: 'consent signed',
        timestamp: Date.now(),
      });

    FlowRouter.go("/comparison/" + this.props.expID + "?workerID=" + this.state.workerID);
  }
}

export default withTracker((props) => {})(Consent)
