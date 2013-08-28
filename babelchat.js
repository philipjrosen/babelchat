Chats = new Meteor.Collection('chats');

if (Meteor.isClient) {
  ///// HELPER FUNCTIONS ////
  var addMessage = function(room_id, user,sourceText, transText, timestamp) {
    if(!sourceText && !room_id) {
      return;
    }
    Chats.update({_id:room_id}, 
      {$addToSet:{
        messages:{
          user: user,
          sourceText: sourceText,
          transText: transText, 
          timestamp: timestamp 
        }
      }
    });
  };

  var translateMessage = function(language, target, user, text, timestamp) {
    var src = language;
    var trg = target;
    var room_id = Session.get('current_room');
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
        var trans = res.data.data.translations[0].translatedText;
        addMessage(room_id, user, text, trans, timestamp);
      }
    });
  };

  var detectLanguage = function(user, text, timestamp) {
    var language;
    var target;
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
        // target = Chats.findOne({_id:Session.get('current_room')});
        target = 'es';
        console.log("langauge detected", language);
        translateMessage(language, target, user, text, timestamp);
      }
    });
  }; 

  ///TEMPLATE HELPERS ///
  Template.roomList.rooms = function () {
    return Chats.find();
  };

  Template.translatedMessages.messages = function() {
    if (Session.equals('current_room', null)) {
      return null;
    } else {
      var currRoom = Chats.findOne({_id:Session.get('current_room')});
      if (currRoom && currRoom.messages) {
        return currRoom.messages;
      }      
    }
  };

  Template.translatedMessages.room_selected = function() {
    return ((Session.get('current_room') !== undefined) && (!Session.equals('current_room',null)));
  };

  Template.roomList.list_status = function() {
    if (Session.equals('current_room', this._id)) {
      return "";
    } else {
      return " btn-inverse";
    }
  };

  ///// EVENT HANDLERS////
  Template.roomList.events({
    'click .room' : function() {
      Session.set('current_room', this._id);
    }
  });

  Template.messageEntry.events({  
    "keypress #message-entry" : function(evt, templ) {
      if(evt.keyCode === 13) {
        evt.preventDefault();
        var text = templ.find("#message-entry").value;
        var ts = new Date();
        var user = "John";
        ts = (ts.getMonth() + 1) + "/" + ts.getDate() + "/" + ts.getFullYear();
        // Messages.insert({
        //   text: text, 
        //   user: user,
        //   ts: ts
        // });
        templ.find('#message-entry').value = "";
        detectLanguage(user, text, ts);
      }
    }
  });

}//END CLIENT CODE

//SERVER CODE//
if (Meteor.isServer) {
  Meteor.startup(function () {
    if(Chats.find().count() === 0) {
      Chats.insert({room:'English'});
      Chats.insert({room:'Spanish'});
      Chats.insert({room:'French'});
      Chats.insert({room:'German'});
    }
  });
}
