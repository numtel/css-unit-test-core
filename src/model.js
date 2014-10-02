CssTests = new Meteor.Collection('CssTests');
CssNormatives = new Meteor.Collection('CssNormatives');
CssHistory = new Meteor.Collection('CssHistory');

if(Meteor.isClient){
  CssTestsHandle = Meteor.subscribe('CssTests');
  CssHistoryHandle = Meteor.subscribe('CssHistory');
};

if(Meteor.isServer){

  CssTests.allow({
    insert: function (userId, test) {
      return false; // contruct new CssTest({}) instead
    },
    update: function (userId, test, fields, modifier) {
      if (userId !== test.owner)
        return false; // not the owner

      // Only allow updating sort order, otherwise use CssTest.update(data)
      var allowed = ['rank'];
      return _.difference(fields, allowed).length === 0;
    },
    remove: function (userId, test) {
      return false; // use CssTest.remove()
    }
  });

  Meteor.publish("CssTests", function () {
    if(this.userId==null){
      return [];
    };
    return CssTests.find({owner: this.userId}, {fields: {thumbnail: 0}});
  });

  Meteor.publish("CssHistory", function () {
    if(this.userId==null){
      return [];
    };
    return CssHistory.find({owner: this.userId});
  });
};
