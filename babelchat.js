Rooms = new Meteor.Collection('rooms');

if (Meteor.isClient) {
  Template.roomList.rooms = function () {
    return Rooms.find({},{sort: {Category: 1}});
  };
}

if (Meteor.isServer) {
  Meteor.startup(function () {
   if(Rooms.find().count() === 0) {
    Rooms.insert({roomName:'English'});
    Rooms.insert({roomName:'Spanish'});
    Rooms.insert({roomName:'French'});
    Rooms.insert({roomName:'German'});
  }
  });
}

