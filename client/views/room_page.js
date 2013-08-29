Template.roomPage.currentRoom = function() {
  return Chats.findOne(Session.get('currentRoomId'));
};
