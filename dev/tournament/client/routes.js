import React, { Component } from 'react';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { mount } from 'react-mounter';
import Comparison from '../imports/ui/Comparison.js';

FlowRouter.route('/home', {
  name: 'Home',
  action(params, queryParams) {
    console.log("This is a Home page.");
  }
});

FlowRouter.route('/Comparison', {
  name: 'Comparison',
  action(params, queryParams) {
    mount(Comparison, {
      answerAID: "iamanswera",
      answerBID: "iamanswerBBB",
      questionText: "I am a test MSMarco question",
    });
  }
});