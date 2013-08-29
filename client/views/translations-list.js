Template.translationsList.messages = function() {
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
Template.translationsList.room_selected = function() {
  return ((Session.get('current_room') !== undefined) && (!Session.equals('current_room',null)));
};
