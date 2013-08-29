Template.roomsList.rooms = function () {
  return Chats.find();
};

Template.roomsList.list_status = function() {
  if (Session.equals('current_room', this._id)) {
    return "";
  } else {
    return " btn-inverse";
  }
};

Template.roomsList.events({
  'click .room' : function() {
    Session.set('current_room', this._id);
  }
});