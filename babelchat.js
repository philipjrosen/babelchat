Rooms = new Meteor.Collection('rooms');
Messages = new Meteor.Collection('messages');
Translations = new Meteor.Collection('translations');

if (Meteor.isClient) {
  Template.roomList.rooms = function () {
    return Rooms.find({},{sort: {Category: 1}});
  };

  // Template.sourceMessages.messages = function() {
  //   return Messagess.find();
  // };

  Template.translatedMessages.translations = function() {
    return Translations.find();
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
    if(Translations.find().count() === 0) {
      Translations.insert({
        user: "John",
        text: "Imaginate"
      });
      Translations.insert({
        user: "Paul",
        text: "Dame tu mano?"
      });
      Translations.insert({
        user: "George",
        text: "Algo"
      });
      Translations.insert({
        user: "Ringo",
        text: "Octupus"
      });
    }
  });
}

