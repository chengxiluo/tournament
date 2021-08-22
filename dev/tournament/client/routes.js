import React, { Component } from 'react';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import { mount } from 'react-mounter';
import Comparison from '../imports/ui/Comparison.js';
import Finish from '../imports/ui/Finish.js';
import Consent from '../imports/ui/Consent.js';

FlowRouter.route('/consent/:expID', {
  name: 'consent',
  action(params, queryParams) {
    mount(Consent, {
      expID: params['expID'],
      workerID: queryParams['workerID'],
    });
  }
});

FlowRouter.route('/home', {
  name: 'Home',
  action(params, queryParams) {
    console.log("This is a Home page.");
  }
});

FlowRouter.route('/Comparison/:expID', {
  name: 'Comparison',
  action(params, queryParams) {
    mount(Comparison, {
      expID: params['expID'],
      workerID: queryParams['workerID'],
    });
  }
});


// last page
FlowRouter.route('/finish/:expID', {
  name: 'Finish',
  action(params, queryParams) {
    console.log("Finish");
    mount(Finish, {
      expID: params['expID'],
      workerID: queryParams['workerID'],
    });
  }
});