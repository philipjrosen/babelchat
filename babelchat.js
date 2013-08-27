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

  var translateMessage = function(user, text, timestamp) {
    var src = 'en';
    var trg = 'es';
    var request_url = 'https://www.googleapis.com/language/translate/v2';
    var request_params = {
      key: 'AIzaSyApd5b77jtVRZCfCAn6wzlaD52FoXeJwCw',
      source: src,
      target: trg,
      q: text
    };
    Meteor.http.get(request_url, {params: request_params}, function (err, res) {  
      if(err){
        console.log(err);
      } else {
        Translations.insert({
          user: user,
          text:res.data.data.translations[0].translatedText,
          ts: timestamp
        });
      }
    });
  };

  Template.messageEntry.events({  
    "keypress #message-entry" : function(evt, templ) {
      if(evt.keyCode === 13) {
        evt.preventDefault();
        var text = templ.find("#message-entry").value;
        var ts = new Date();
        var user = "John";
        ts = (ts.getMonth() + 1) + "/" + ts.getDate() + "/" + ts.getFullYear();
        Messages.insert({
          text: text, 
          user: user,
          ts: ts
        });
        templ.find('#message-entry').value = "";
        translateMessage(user, text, ts);
      }
    }
  });
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

