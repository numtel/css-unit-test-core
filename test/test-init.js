userId = 'mr.big';

newTest = {
  title: 'Test Case',
  widths: '1024,720',
  owner: userId,
  // cssFiles/remoteStyles manipulated by the individual tests typically
  cssFiles: '',
  // fixtureHtml should include a nested element to test children in extractStyles
  fixtureHtml: '<h1>Test <em>html</em></h1>'
};

if(Meteor.isServer){
  ServerObject.allow({
    'CssTest': {
      ref: CssTest,
      allowConstructor: function(args){
        // If creating new, owner must be set to userId
        if(args.length > 0 && 
           (args[0] == null || 
             (typeof args[0] === 'object' && 
             args[0].owner !== userId))){
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
