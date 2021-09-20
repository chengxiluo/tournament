import React, { Component } from 'react';

import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
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
            This study is conducted by Prof. Charles Clarke at the School of Computer Science of the University of Waterloo, Canada.
          </p>
          </div>

          <div className="row consent">
          <p>
            The objective of the study is to improve machine learning algorithms for
            answer selection for conversational assistants such as Amazon Alexa, Siri, etc.
          </p>
          </div>

          <div className="row consent">
            <p><b>Study details. </b>If you decide to participate, you will see a question and a short passage of text intended to answer the question. At the bottom are three buttons:</p>

            <br/>
            <ul>
              <li>Yes, the passage answers the question. </li>
              <li>No, the passage does not answer the question. </li>
              <li>Partially, the passage provides related information. </li>
            </ul>
            
            <p>
            Click <b>Yes</b> if the passage would be a reasonable answer from Siri, Google Assistant or Alexa in response to the question. It may contain extraneous information not related to the question. The passage need not be a grammatically correct response to the question.
           </p>
           
            <p>
            Click <b>Partially</b> if the passage contains information related to the question but does not directly answer it.
            </p>
            
            <p>
            Click <b>No</b> if the passage is not related to the question.
            </p>
            
            <p>
            Each HIT contains 14 questions and takes around 10-12 minutes to complete. After completing all questions, you will be taken to a page with a confirmation code. Use this code to complete the HIT on the Amazon Mechanical Turk platform.
            </p>
          </div>



          <div className="row consent">
           <p> <b>Remuneration.</b> For the participation in the study you will be
            paid USD 2 per HIT. You may choose to withdraw from the task at
            any point by clicking the “Exit task” button in the top right corner
            of the screen. “Exit task” button will take you to the screen with MTurk code.
            You will get remunerated ¢10 for starting the HIT, ¢10 for each completed
            search task, and ¢50 for finishing the entire HIT.</p>
          </div>

          <div className="row consent">
            <p> <b>Inclusion/exclusion criteria</b>. We seek participants who are proficient in English.</p>
          </div>

          <div className="row consent">
            <p><b>Withdrawal.</b> PParticipation in this study is voluntary. You may decline to interact with the interface or decline to answer any questions in the questionnaire at any time you want. If after finishing the task you wish to withdraw the data you have provided, you can do so by contacting Charles L.A. Clarke at claclark@gmail.com. You may withdraw your data up until the dataset is released publicly on January 31, 2022.</p>
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
             Charles L.A. Clarke (claclark@gmail.com). Further, if you would like to
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
