Template.roomPage.currentRoom = function() {
  // return Chats.findOne(Session.get('currentRoomId'));
  return Chats.findOne(Session.get('current_room'));
};
