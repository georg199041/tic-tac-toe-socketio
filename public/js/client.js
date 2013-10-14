$(document).ready(function() {

	var socket = io.connect(document.location.href);

	var player = {
		id: 0,
		name: prompt("Введите Ваше имя:"),
		mark: 'x'
	};
	var xo = 'x';
	var gameover = false;
	var startGame = false;

	if ( player.name == '' ) {
		player.name = 'Аноним';
	}

	socket.on('connect', function () {
		socket.emit('client_connected', player);
	});		

	function mark(cords) {
		if(startGame) {
			if(player.mark != xo) {
				$("#stats").html('Сейчас не Ваш ход').hide().fadeIn(1000).fadeOut(1000);
			} else {
				if($(cords).html() == '') {
					socket.emit("process_move", cords, player);
				} else {
					$("#stats").html('Так нельзя походить').hide().fadeIn(1000).fadeOut(1000);
				}
			}
		} else {
			$("#stats").html('Ждем второго игрока...').hide().fadeIn(1000).fadeOut(1000);
		}
	}

	$('td').each(function() {
		$(this).on('click', function() {
			mark('#' + $(this).attr('id'));
		});
	});

	socket.on('mark', function(sq) {
		sq = '#' + sq;
		if($(sq).html() == '') {
			if( xo == 'x') {
				$(sq).html('X');
				xo = 'o';
				$(sq).css('color','red');
			} else {
				$(sq).html('O');
				$(sq).css('color','blue');
				xo = 'x';
			}  
		}
	});

	socket.on('load', function(data) {
		var x = 0;
		var showedX, showedO = false;
		while( x < data.length ) {
			if(data[x].mark == 'x') {
				$("#p1").html(data[x].name + ": <span style='color:red'>X</span>");
				showedX = true;
			} else if(data[x].mark == 'o') {
				$("#p2").html(data[x].name + ": <span style='color:blue'>O</span>");
				showedO = true;
			}
			x++;
		}

		if(!showedX) $("#p1").html("Ждем...");
		if(!showedO) $("#p2").html("Ждем...");

		if(showedX && showedO) startGame = true;

	});

	socket.on('connect_1', function(data){
		player.id = data.id;
		player.name = data.name;
		player.mark = data.mark;
	});

	socket.on('gameover', function(data){
		gameover = true;
		$("#stats").html("Конец игры!").hide().fadeIn(1000);
	});

});