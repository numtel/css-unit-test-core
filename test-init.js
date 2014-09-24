userId = 'mr.big';

newTest = {
  title: 'Test Case',
  widths: '1024,720',
  owner: userId
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
};
