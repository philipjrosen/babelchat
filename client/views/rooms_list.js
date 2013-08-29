Template.roomsList.rooms = function () {
  return Chats.find({}, {sort: {room: 1}});
};

Template.roomsList.list_status = function() {
  if (Session.equals('current_room', this._id)) {
    return "";
  } else {
    return " btn-inverse";
  }
};

Template.roomsList.events({
  'click .room': function() {
  	var route = '/rooms/' + this._id;
  	Meteor.Router.to(route);
  }
});

//Old version before Router added//
// Template.roomsList.events({
//   'click .room' : function() {
//     Session.set('current_room', this._id);
//   }
// });

