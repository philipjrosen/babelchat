Chats = new Meteor.Collection('chats');

if (Meteor.isClient) {
  ///// HELPER FUNCTIONS ////

  var globals = {
    url: 'https://www.googleapis.com/language/translate/v2',
    key: 'AIzaSyApd5b77jtVRZCfCAn6wzlaD52FoXeJwCw'
  };  

  var addMessage = function(room_id, user, sourceText, transText, timestamp) {
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
 
  var callGoogle = function(room_id, user, text, timestamp, params) {
    Meteor.http.get(globals.url, {params: params}, function (err, res) {  
      if(err){
        console.log(err);
      } else {
        var trans = res.data.data.translations[0].translatedText;
        addMessage(room_id, user, text, trans, timestamp);
      }
    });
  };  

  var translateMessage = function(language, user, text, timestamp) {
    var src = language;
    var room_id = Session.get('current_room');
    var currRoom = Chats.findOne({_id:room_id});
    var trg = currRoom.target;
    var params = {key: globals.key, source: src, target: trg, q: text};
    callGoogle(room_id, user, text,timestamp, params);
  };

  var detectLanguage = function(user, text, timestamp) {
    var language;
    var url = globals.url + '/detect';
    var params = {key: globals.key, q: text};

    Meteor.http.get(url, {params: params}, function (err, res) {  
      if(err){
        console.log(err);
      } else {
        language = res.data.data.detections[0][0].language;
        translateMessage(language, user, text, timestamp);
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
      Chats.insert({room:'English', target:'en'});
      Chats.insert({room:'Spanish', target:'es'});
      Chats.insert({room:'French',  target:'fr'});
      Chats.insert({room:'German',  target:'de'});
      Chats.insert({room:'Hebrew',  target:'iw'});
      Chats.insert({room:'Italian', target:'it'});
    }
  });
}
