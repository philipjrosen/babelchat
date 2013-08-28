Chats = new Meteor.Collection('chats');
// Rooms = new Meteor.Collection('rooms');
Messages = new Meteor.Collection('messages');
Translations = new Meteor.Collection('translations');

if (Meteor.isClient) {
  Template.roomList.rooms = function () {
    return Chats.find({},{sort: {rooms: 1}});
  };

  // Template.sourceMessages.messages = function() {
  //   return Messagess.find();
  // };

  Template.translatedMessages.translations = function() {
    return Translations.find();
  };
///// HELPER FUNCTIONS ////
  var translateMessage = function(language, user, text, timestamp) {
    var src = language;
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
          text: res.data.data.translations[0].translatedText,
          ts: timestamp
        });
      }
    });
  };

  var detectLanguage = function(user, text, timestamp) {
    var language;
    var request_url = 'https://www.googleapis.com/language/translate/v2/detect';
    var request_params = {
      key: 'AIzaSyApd5b77jtVRZCfCAn6wzlaD52FoXeJwCw',
      q: text
    };

    Meteor.http.get(request_url, {params: request_params}, function (err, res) {  
      if(err){
        console.log(err);
      } else {
        language = res.data.data.detections[0][0].language;
        console.log("langauge detected", language);
        translateMessage(language, user, text, timestamp);
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
        detectLanguage(user, text, ts);
      }
    },
  });
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    if(Chats.find().count() < 6) {
      Chats.insert({
        "room": "Spanish",
        "messsages" : [
          {
          "user" : "John",
          "sourceText" : "Imagine",
          "transText" : "Imaginate",
          "timestamp"   :  10001 
          },
          {
          "user" : "Paul",
          "sourceText" : "Yesterday",
          "transText" : "Ayer",
          "timestamp"   :  10002 
          }
        ]
      });
      Chats.insert({
        "room": "German",
        "messsages" : [
          {
          "user" : "John",
          "sourceText" : "Imagine",
          "transText" : "Stell' dir vor",
          "timestamp"   :  10001 
          },
          {
          "user" : "Paul",
          "sourceText" : "Yesterday",
          "transText" : "Gestern",
          "timestamp"   :  10002 
          }
        ]
      });
    }
  });
}

// if (Meteor.isServer) {
//   Meteor.startup(function () {
//     if(Rooms.find().count() === 0) {
//       Rooms.insert({roomName:'English'});
//       Rooms.insert({roomName:'Spanish'});
//       Rooms.insert({roomName:'French'});
//       Rooms.insert({roomName:'German'});
//     }
//     if(Translations.find().count() === 0) {
//       Translations.insert({
//         user: "John",
//         text: "Imaginate"
//       });
//       Translations.insert({
//         user: "Paul",
//         text: "Dame tu mano?"
//       });
//       Translations.insert({
//         user: "George",
//         text: "Algo"
//       });
//       Translations.insert({
//         user: "Ringo",
//         text: "Octupus"
//       });
//     }
//   });
// }

