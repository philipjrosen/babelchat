Template.roomsList.rooms = function () {
  return Chats.find({}, {sort: {room: 1}});
};

Template.roomsList.btn_type = function() {
  if (Session.equals('current_room', this._id)) {
    return "";
  } else {
    return " btn-inverse";
  }
};

Session.set('adding_room', false);

Template.roomsList.new_room = function () {
  return Session.equals('adding_room',true);
};

Template.roomsList.events({
  'click .room': function() {
  	var route = '/rooms/' + this._id;
  	Meteor.Router.to(route);
  },

  'click #btnNewRoom' : function (evt, templ) {
    Session.set('adding_room', true);
    Meteor.flush();
    templ.find('#add-room').focus();
    // $('#add-room').autocomplete({
    //   source: availableLangs
    // });
  },

  'keyup #add-room' : function(evt, templ) {
    if (evt.which === 13) {
      var roomVal = evt.target.value || "";
    }
    if (roomVal) {
      var targVal = Languages.findOne({name:roomVal}).language;
      Chats.insert({room: roomVal, target: targVal});
      var roomId = Chats.findOne({room:roomVal})._id;
      var route = '/rooms/' + roomId;
      console.log(route);
      Meteor.Router.to(route);
      Session.set('adding_room', false);
    }
    if (evt.which === 27) {
     Session.set('adding_room', false); 
    }
  },

  'focusout #add-room' : function(evt, templ) {
    Session.set('adding_room', false);
  }

});


