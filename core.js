module.exports = function(io) {
	var xo = 'x'; 
	var o = false;
	var m_players = [];
	var i = 0; 

	var grid = {
	  '0-0': '', '0-1':'', '0-2':'', '0-3':'', '0-4':'',
	  '1-0': '', '1-1':'', '1-2':'', '1-3':'', '1-4':'',
	  '2-0': '', '2-1':'', '2-2':'', '2-3':'', '2-4':'',
	  '3-0': '', '3-1':'', '3-2':'', '3-3':'', '3-4':'',
	  '4-0': '', '4-1':'', '4-2':'', '4-3':'', '4-4':'',
	};

	io.sockets.on('connection', function(socket) {
	  
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

	  	// check win
		function finished() {

			var isFinished = (grid['0-0'] == grid['0-1'] && grid['0-1'] == grid['0-2'] && grid['0-2'] == grid['0-3'] && grid['0-3'] == grid['0-4']&& grid['0-0'] != '') || 
			    (grid['1-0'] == grid['1-1'] && grid['1-1'] == grid['1-2'] && grid['1-2'] == grid['1-3'] && grid['1-3'] == grid['1-4']&& grid['1-0'] != '') ||
			    (grid['2-0'] == grid['2-1'] && grid['2-1'] == grid['2-2'] && grid['2-2'] == grid['2-3'] && grid['2-3'] == grid['2-4']&& grid['2-0'] != '') ||
			    (grid['3-0'] == grid['3-1'] && grid['3-1'] == grid['3-2'] && grid['3-2'] == grid['3-3'] && grid['3-3'] == grid['3-4']&& grid['3-0'] != '') ||
			    (grid['4-0'] == grid['4-1'] && grid['4-1'] == grid['4-2'] && grid['4-2'] == grid['4-3'] && grid['4-3'] == grid['4-4']&& grid['4-0'] != '') ||

			    (grid['0-0'] == grid['1-0'] && grid['1-0'] == grid['2-0'] && grid['2-0'] == grid['3-0'] && grid['3-0'] == grid['4-0'] && grid['0-0'] != '') ||
			    (grid['0-1'] == grid['1-1'] && grid['1-1'] == grid['2-1'] && grid['2-1'] == grid['3-1'] && grid['3-1'] == grid['4-1'] && grid['0-1'] != '') ||
			    (grid['0-2'] == grid['1-2'] && grid['1-2'] == grid['2-2'] && grid['2-2'] == grid['3-2'] && grid['3-2'] == grid['4-2'] && grid['0-2'] != '') ||
			    (grid['0-3'] == grid['1-3'] && grid['1-3'] == grid['2-3'] && grid['2-3'] == grid['3-3'] && grid['3-3'] == grid['4-3'] && grid['0-3'] != '') ||
			    (grid['0-4'] == grid['1-4'] && grid['1-4'] == grid['2-4'] && grid['2-4'] == grid['3-4'] && grid['3-4'] == grid['4-4'] && grid['0-4'] != '') ||

			    (grid['0-0'] == grid['1-1'] && grid['1-1'] == grid['2-2'] && grid['2-2'] == grid['3-3'] && grid['3-3'] == grid['4-4'] && grid['0-0'] != '') ||
			    (grid['4-0'] == grid['3-1'] && grid['3-1'] == grid['2-2'] && grid['2-2'] == grid['1-3'] && grid['1-3'] == grid['0-4'] && grid['4-0'] != '') ||
			    ((grid['0-0'] != '' && grid['0-1'] != '' && grid['0-2'] != '' && grid['0-3'] != '' && grid['0-4'] != '') && 
			     (grid['1-0'] != '' && grid['1-1'] != '' && grid['1-2'] != '' && grid['1-3'] != '' && grid['1-4'] != '') && 
			     (grid['2-0'] != '' && grid['2-1'] != '' && grid['2-2'] != '' && grid['2-3'] != '' && grid['2-4'] != '') &&
			     (grid['3-0'] != '' && grid['3-1'] != '' && grid['3-2'] != '' && grid['3-3'] != '' && grid['3-4'] != '') && 
			     (grid['4-0'] != '' && grid['4-1'] != '' && grid['4-2'] != '' && grid['4-3'] != '' && grid['4-4'] != ''));
console.log((grid['3-0'] == grid['3-1'] && grid['3-1'] == grid['3-2'] && grid['3-2'] == grid['3-3'] && grid['3-3'] == grid['3-4']&& grid['3-0'] != ''))
			return 	isFinished;		    
		};

		function clearGrid() {
			for (i in grid) {
				grid[i] = '';
			}
		};

		socket.on('process_move', function(coords, player) {
			coords = coords.replace("#",'');
			if (player.id == socket.id) {
				grid[coords] = player.mark;
			}
			console.log(grid);
			io.sockets.emit('mark', coords);

			if(finished()) {
				io.sockets.emit('gameover', xo);
				clearGrid();
			}
		});

		socket.on('disconnect', function() {
			var j = 0;
			var n = 0;
			var tmp = [];
			
			//when player quits
			while ( n < m_players.length ) {
				if ( m_players[j].id == socket.id ) {
					if( m_players[j].mark == 'o' ) {
						xo = 'o';
					}
					if( m_players[j].mark == 'x' ) {
						xo = 'x';
					}
					n++;
				}

				if ( n < m_players.length ) {
					tmp[j] = m_players[n];
					j++;
					n++;
				}
			}
			if (io.sockets.clients().length <= 1) {
				clearGrid();
				xo = 'x';
				o = false;
			}
			m_players = tmp;
			i = j;
			io.sockets.emit('load', m_players);
		});
	});
}