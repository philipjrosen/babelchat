Languages = new Meteor.Collection('languages');

Languages.allow({
  insert: function (userId, doc) { return !! userId; },
  update: function (userId, doc) { return !! userId; },
});
