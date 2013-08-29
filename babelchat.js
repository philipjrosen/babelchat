Chats = new Meteor.Collection('chats');

if (Meteor.isClient) {
  ///// HELPER FUNCTIONS ////

  var globals = {
    url: 'https://www.googleapis.com/language/translate/v2',
    key: 'AIzaSyApd5b77jtVRZCfCAn6wzlaD52FoXeJwCw'
  };  

  var addMessage = function(user, text, timestamp, translation, room_id) {
    if(!text && !room_id) {
      return;
    }
    Chats.update({_id:room_id}, 
      {$addToSet:{
        messages:{
          user: user,
          sourceText: text,
          transText: translation, 
          timestamp: timestamp 
        }
      }
    });
  };
 
  var callGoogle = function(user, text, timestamp, params, url, room_id) {
    var toggle = arguments.length;
    Meteor.http.get(url, {params: params}, function (err, res) {  
      if(err){
        console.log(err);
      } else {
        if (toggle === 6) {
          var translation = res.data.data.translations[0].translatedText;
          addMessage(user, text, timestamp, translation, room_id);
        } else if (toggle === 5) {
          var language = res.data.data.detections[0][0].language;
          translateMessage(user, text, timestamp, language);
        }
      }
    });
  };  

  var translateMessage = function(user, text, timestamp, language) {
    var src = language;
    var room_id = Session.get('current_room');
    var currRoom = Chats.findOne({_id:room_id});
    var trg = currRoom.target;
    var url = globals.url;
    var params = {key: globals.key, source: src, target: trg, q: text};
    //if the user chooses to type in the language of the current room
    if (src === trg) {
      addMessage(user, text, timestamp, text, room_id);
    } else {
    //call the API to translate the message text
      callGoogle(user, text, timestamp, params, url, room_id);
    }
  };

  var detectLanguage = function(user, text, timestamp) {
    var language;
    var url = globals.url + '/detect';
    var params = {key: globals.key, q: text};

    //call the API to detect the input language
    callGoogle(user, text, timestamp, params, url)
  }; 

  ///TEMPLATE HELPERS ///
  Template.roomsList.rooms = function () {
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
  //It doesn't seem like this variable is used anywhere
  Template.translatedMessages.room_selected = function() {
    return ((Session.get('current_room') !== undefined) && (!Session.equals('current_room',null)));
  };

  Template.roomsList.list_status = function() {
    if (Session.equals('current_room', this._id)) {
      return "";
    } else {
      return " btn-inverse";
    }
  };

  ///// EVENT HANDLERS////
  Template.roomsList.events({
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
