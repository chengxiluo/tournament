import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';

export const Candidates = new Mongo.Collection('candidates');
export const Topics = new Mongo.Collection('topics');
export const Pairs = new Mongo.Collection('pairs');
export const Users = new Mongo.Collection('users');
export const Judgements = new Mongo.Collection('judgements');
export const Experiments = new Mongo.Collection('experiments');
export const Golden = new Mongo.Collection('golden');
export const CompletionCodes = new Mongo.Collection('completionCodes');
export const Logs = new Mongo.Collection('logs');


if (Meteor.isServer) {
  Meteor.publish('candidates', function(){
    // console.log("publish candidates");
    return Candidates.find({});
  });

  Meteor.publish('topics', function(){
    // console.log("publish topics");
    return Topics.find({});
  });

  Meteor.publish('pairs', function(){
    // console.log("publish pairs");
    return Pairs.find({});
  });

  Meteor.publish('users', function(){
    // console.log("publish pairs");
    return Users.find({});
  });

  Meteor.publish('judgements', function(){
    // console.log("publish pairs");
    return Judgements.find({});
  });

  Meteor.publish('experiments', function(){
    // console.log("publish pairs");
    return Experiments.find({});
  });

  Meteor.publish('golden', function(){
    // console.log("publish pairs");
    return Golden.find({});
  });

  Meteor.publish('completionCodes', function(){
    // console.log("publish pairs");
    return CompletionCodes.find({});
  });

  Meteor.publish('logs', function(){
    // console.log("publish pairs");
    return Logs.find({});
  });
}