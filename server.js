var app = require('http').createServer(handler);
var io = require('socket.io')(app);
var fs = require('fs');
var port = 80;
var leaderboard = [];
var pass = '20001221';

app.listen(port, function(){
  console.log('listening on port '+port);
});

function handler (req, res) {
    res.writeHead(200);
    res.end('server is up');
}

//socket
io.on('connection', function (socket) {
  console.log('a user CONNECTED on '+ Date());
  socket.emit('connected');
  socket.emit('updateL', leaderboard);

  socket.on('score',function(scoredata){
    leaderboard.push(scoredata);
    leaderboard.sort(function(a,b){
      return b.score-a.score;
    });
    io.emit('updateL', leaderboard);
  });

  socket.on('clear', function(password){
    if(password == pass){
      leaderboard = [];
      io.emit('updateL', leaderboard);
    }
  });

  socket.on('disconnect', function(){
    console.log('a user DISCONNECTED on ' + Date());
  });
});
