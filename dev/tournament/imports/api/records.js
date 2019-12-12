import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';

export const Candidates = new Mongo.Collection('candidates');
export const Topics = new Mongo.Collection('topics');

if (Meteor.isServer) {
  Meteor.publish('candidates', function(){
    return Candidates.find({});
  });

  Meteor.publish('topics', function(){
    return Topics.find({});
  });
}