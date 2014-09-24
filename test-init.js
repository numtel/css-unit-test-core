var userId = 'mr.big';

newTest = {
  title: 'Test Case',
  widths: '1024,720',
  owner: userId
};

if(Meteor.isServer){
  ServerObject.allow({
    'CssTest': {
      ref: CssTest,
      where: function(){
        // Only allow client to load tests that it owns
        return this.owner === userId;
      }
    }
  });
};
