exports.index = function(req, res){
  res.render('index', { title: 'Express' });
};

exports.room1 = function(req, res, next){
  res.render('room1', { title: 'Chat Room1' });
};

exports.room2 = function(req, res, next){
  res.render('room2', { title: 'Chat Room2' });
};
