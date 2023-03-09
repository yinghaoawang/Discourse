const serversDb = [{
    name: 'a',
    channels: [{
      name: 'first',
      posts: [
        { user: { name: 'Admin' }, message: 'Hey, welcome to a-first', dateCreated: '2023-03-05T02:50:40.183Z'},
      ]
    }]
    
  }, {
    name: 'b',
    channels: [{
      name: 'bchannel',
      posts: [
        { user: { name: 'guy' }, message: 'howdy, this is bchannel', dateCreated: '2023-03-05T02:50:40.183Z'},
      ]
    },
    {
      name: 'yoyo',
      posts: [
        { user: { name: 'eminem' }, message: 'balms r sweaty', dateCreated: '2023-03-05T02:50:40.183Z'},
        { user: { name: 'eminem' }, message: 'knees meat', dateCreated: '2023-03-05T02:50:40.183Z'},
        { user: { name: 'eminem' }, message: 'arms spaghetti', dateCreated: '2023-03-05T02:50:40.183Z'},
        { user: { name: 'eminem' }, message: 'moms are heavy', dateCreated: '2023-03-05T02:50:40.183Z'},
      ]
    }]
    
  }, {
    name: 'c',
    channels: [{
      name: 'empty',
      posts: []
    }]
  }];

  module.exports = serversDb;