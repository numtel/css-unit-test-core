userId = 'mr.big';

newTest = {
  title: 'Test Case',
  widths: '1024,720',
  owner: userId,
  cssFiles: 'http:/test.com/test.css',
  fixtureHtml: '<h1>Test html</h1>'
};

if(Meteor.isServer){
  ServerObject.allow({
    'CssTest': {
      ref: CssTest,
      allowConstructor: function(args){
        // If creating new, owner must be set to userId
        if(args.length > 0 && 
           typeof args[0] === 'object' && 
           args[0].owner !== userId){
          return false;
        };
        return true;
      }
    }
  });


  // The client may want to know the asset directory
  Meteor.methods({
    'CssTest/assetDir': function(){
      return assetDir;
    }
  });
};
