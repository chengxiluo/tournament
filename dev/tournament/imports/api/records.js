import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';

export const Candidates = new Mongo.Collection('candidates');
export const Topics = new Mongo.Collection('topics');
export const Pairs = new Mongo.Collection('pairs');
export const Users = new Mongo.Collection('users');


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

}