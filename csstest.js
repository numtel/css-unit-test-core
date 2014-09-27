CssTest = function(arg){
  var data;
  if(typeof arg === 'string'){
    // Test ID has been passed in
    data = CssTests.findOne(arg);
    if(data === undefined){
      throw new Meteor.Error(404, 'Invalid Test Id!');
    };
  }else if(typeof arg === 'object'){
    // Creating new test
    validatePost(arg, true);

    data = {
      _id: arg._id || Random.id(),
      rank: arg.rank || 0,
    };

    // Fields must be defined to be initialized
    _.each(fieldDefs, function(def, key){
      data[key] = arg[key];
    });

    CssTests.insert(data, function(error, result){
      if(error){
        throw error;
      };
    });
  }else{
    throw new Meteor.Error(400, 'Invalid constructor argument.');
  };

  extendData(this, data);
};

var fieldDefs = {
  title: ['Title', 'string', {min: 1, max: 100}],
  owner: ['Owner', 'string', {min: 1, max: 100}],
  description: ['Description', 'string', {min: 0, max: 1000}],
  interval: ['Schedule Interval', 'integer', {optional: true, min:1}],
  remoteStyles: ['Remote Styles', 'string', {min:0, max:1000}],
  cssFiles: ['CSS Files', 'string', {min:0, max: 10000}],
  testUrl: ['Test URL', 'string', {min:0, max:1000}],
  fixtureHtml: ['Fixture HTML', 'string', {min: 0, max: 100000}],
  widths: ['Test Resolution Widths', 'integerList', {}]
};

var validatePost = function(data, isCreate){
  var validators = {
    string: function(key, value, label, options){
      if(options.min !== undefined && options.min > 0 &&
          (!value || value.length < options.min)){
        return label + ' is too short.';
      };
      if(options.max !== undefined && value !== undefined && value.length > options.max){
        return label + ' is too long.';
      };
      return true;
    },
    integer: function(key, value, label, options){
      if((value === '' || value === undefined) && options.optional){
        return true;
      };
      if(!/^[0-9-]+$/.test(value)){
        return label + ' must be an integer.';
      };
      if(options.min !== undefined && value < options.min){
        return label + ' must be at least ' + options.min + '.';
      };
      if(options.max !== undefined && value > options.max){
        return label + ' must be no more than ' + options.max + '.';
      };
      return true;
    },
    integerList: function(key, value, label, options){
      if(!/^[0-9,\s]+$/.test(value)){
        return label + ' may only include numbers, commas, and spaces.';
      };
      return true;
    }
  };
  var validate = function(key, value){
    if(fieldDefs.hasOwnProperty(key)){
      return validators[fieldDefs[key][1]](key, value, fieldDefs[key][0], fieldDefs[key][2])
    };
    return 'Post error!';
  };
  if(!isCreate){
    // Modifying a test, ensure that each passed value matches
    _.each(data, function(value, key){
      var result = validate(key, value);
      if(result !== true){
        throw new Meteor.Error(406, result);
      };
    });
  }else{
    // Creating a test, make sure every field validates
    _.each(fieldDefs, function(options, key){
      var result = validate(key, data[key]);
      if(result !== true){
        throw new Meteor.Error(406, result);
      };
    });
  };
};

var extendData = function(obj, data){
  _.extend(obj, data);

  // Convert widths string into array
  if(obj.widths){
    obj.widthsArray = obj.widths.split(',').map(function(width){
      return parseInt(width.trim(), 10);
    });
  };
};

CssTest.prototype.remove = function(){
  CssTests.remove(this._id);

  _.each(this, function(val, key){
    this[key] = undefined;
  }, this);

  this.prototype = {};
};

CssTest.prototype.update = function(data){
  var that = this;
  validatePost(data);

  // Require new normative if these fields change
  ['widths'].forEach(function(field){
    if(data[field] !== undefined && data[field] !== that[field]){
      data.hasNormative = false;
    };
  });

  // Update nextRun if interval changes
  if(data.interval !== undefined && data.interval !== that.interval){
    if(data.interval === ''){
      data.nextRun = undefined;
    }else{
      // Last run or current time + interval
      data.nextRun = (that.lastRun ? that.lastRun : Date.now()) +
                      (parseInt(data.interval, 10) * 1000 * 60);
    };
  };

  CssTests.update(this._id, {$set: data});
  extendData(this, data);
};
