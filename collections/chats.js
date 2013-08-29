Chats = new Meteor.Collection('chats');

Chats.allow({
  insert: function (userId, doc) { return !! userId; },
  update: function (userId, doc) { return !! userId; },
  //might want to give the user the ability to delete messages:
  // remove: function () { return !! userId; },
  // fetch:  function () { return !! userId; }
});
