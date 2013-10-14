module.exports = function(io) {
	var xo = 'x'; 
	var o = false;
	var m_players = [];
	var i = 0; 

	var grid = {
	  '0-0': '', '0-1':'', '0-2':'',
	  '1-0': '', '1-1':'', '1-2':'',
	  '2-0': '', '2-1':'', '2-2': ''
	};
	io.sockets.on('connection', function(socket) {
	  console.log(grid);
	  socket.on('client_connected', function(player) {
	    player.id = socket.id;
	    player.mark = xo;
	    if(xo == 'x' && o == false) {
	      xo = 'o';
	      o = true;
	    } else {
	      xo = 'spectator';
	    }
	    m_players[i] = player;
	    i++;
	    socket.emit('connect_1', player);
	    io.sockets.emit('load',m_players);
	  });

	  socket.on('process_move', function(coords, player) {
	    coords = coords.replace("#",'');
		if (player.id == socket.id) {
			grid[coords] = player.mark;
		}
	    
	    io.sockets.emit('mark', coords);

	    // check win
	    if( (grid['0-0'] == grid['0-1'] && grid['0-1'] == grid['0-2'] && grid['0-0'] != '') || 
	    (grid['1-0'] == grid['1-1'] && grid['1-1'] == grid['1-2'] && grid['1-0'] != '') ||
	    (grid['2-0'] == grid['2-1'] && grid['2-1'] == grid['2-2'] && grid['2-0'] != '') ||

	    (grid['0-0'] == grid['1-0'] && grid['1-0'] == grid['2-0'] && grid['0-0'] != '') ||
	    (grid['0-1'] == grid['1-1'] && grid['1-1'] == grid['2-1'] && grid['0-1'] != '') ||
	    (grid['0-2'] == grid['1-2'] && grid['1-2'] == grid['2-2'] && grid['0-2'] != '') ||

	    (grid['0-0'] == grid['1-1'] && grid['1-1'] == grid['2-2'] && grid['0-0'] != '') ||
	    (grid['2-0'] == grid['1-1'] && grid['1-1'] == grid['0-2'] && grid['2-0'] != '') 
	    ) {
	      io.sockets.emit('gameover', xo);
	      // clear grid
	      var i;
	      for (i in grid) {
	        grid[i] = '';
	      }
	    }
	  });

	  socket.on('disconnect', function() {
	    var j = 0;
	    var n = 0;
	    var tmp = [];

	    while (n < m_players.length) {
	      if (m_players[j].id == socket.id) {
	        if(m_players[j].mark == 'o') {
	          xo = 'o';
	          o = false;
	        }
	        if(m_players[j].mark == 'x') {
	          xo = 'x';
	        }
	        n++;
	      }

	      if (n < m_players.length) {
	        tmp[j] = m_players[n];
	        j++;
	        n++;
	      }
	    }

	    m_players = tmp;
	    i = j;
	    io.sockets.emit('load', m_players);
	  });
	});
}