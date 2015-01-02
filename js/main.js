var colors = ['#000000','#CC7777','#CC8F77','#CCBB77','#AFCC77','#77CC93','#77ADCC','#777FCC','#BD77CC','#E249AE','#E24962'];

var grid = [[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0]];

var continued = false;

function randInt(min,max) {
	var range = max-min+1;
	var increment = 1/range;
	return Math.floor(Math.random()/increment)+min;
}

function alignObjects() {
	$(".object").each(function() {
		var x = $(this).data('x');
		var y = $(this).data('y');
		$(this).animate({
				'left':x*25+'%',
				'top':y*25+'%'
			},
			{
				'duration':200,
				'queue':false
			});
	});
}

function generateGrid() {
	for(var i = 0; i < 4; i ++) {
		for(var j = 4; j < 8; j ++) {	
			grid[j][i] = randInt(1,2);
		}
	}
}

function updateObjects() {
	for(var i = 0; i < 4; i ++) {
		var y = 3;
		var j = 7;
		while(y > -1) {
			var value = grid[j][i];
			if(value > 0) {
				var object = $("#"+i+""+y);
				object.children().first().text(value);
				if(value > 10) value = 10;
				object.css({'left':i*25+'%','top':(j-4)*25+'%','background':colors[value]});
				y --;
			}
			j --;
		}
	}
	alignObjects();
}

function getNeighbors(x,y,subgrid) {
	var value = subgrid[y][x];
	subgrid[y][x] = 0;
	var newNeighbors = [];
	if(x > 0) {
		if(subgrid[y][x-1] == value) {
			newNeighbors.push([x-1,y]);
			newNeighbors = newNeighbors.concat(getNeighbors(x-1,y,subgrid));
		}
	}
	if(y > 0) {
		if(subgrid[y-1][x] == value) {
			newNeighbors.push([x,y-1]);
			newNeighbors = newNeighbors.concat(getNeighbors(x,y-1,subgrid));
		}
	}
	if(x < 3) {
		if(subgrid[y][x+1] == value) {
			newNeighbors.push([x+1,y]);
			newNeighbors = newNeighbors.concat(getNeighbors(x+1,y,subgrid));
		}
	}
	if(y < 3) {
		if(subgrid[y+1][x] == value) {
			newNeighbors.push([x,y+1]);
			newNeighbors = newNeighbors.concat(getNeighbors(x,y+1,subgrid));
		}
	}
	return newNeighbors;
}

function updateGrid() {
	for(var i = 0; i < 4; i ++) {
		for(var j = 0; j < 4; j ++) {
			var object = $("#"+i+""+j);
			var value = object.children().first().text();
			grid[j+4][i] = value;
		}
	}
}

function check() {
	var won = false;
	var lost = true;
	for(var i = 0; i < 4; i ++) {
		for(var j = 0; j < 4; j ++) {
			var value = grid[j+4][i];
			if(value == 9 && !continued) won = true;
			if(i > 0) if(grid[j+4][i-1] == value) lost = false;
			if(i < 3) if(grid[j+4][i+1] == value) lost = false;
			if(j > 0) if(grid[j+3][i] == value) lost = false;
			if(j < 3) if(grid[j+5][i] == value) lost = false; 
		}
	}
	if(won) {
		setTimeout(function() {
			$(".win-overlay").fadeIn();
		},500);
	}else
	if(lost) {
		setTimeout(function() {
			$(".lose-overlay").fadeIn();
		},500);
	}
}

function fold(x,y) {
	var subgrid = [[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0]];
	for(var i = 0; i < 4; i ++) {
		for(var j = 0; j < 4; j ++) {
			subgrid[i][j] = grid[i+4][j];
		}
	}
	var neighbors = getNeighbors(x,y,subgrid);
	if(neighbors.length > 0) {
		for(var i = 0; i < neighbors.length; i ++) {
			var nX = neighbors[i][0];
			var nY = neighbors[i][1];
			grid[nY+4][nX] = 0;
		}
		grid[y+4][x] ++;
		var max = 0;
		for(var i = 0; i < 4; i ++) {
			for(var j = 0; j < 4; j ++) {
				if(grid[j+4][i] > max) max = grid[j+4][i];
			}
		}
		min = 1;
		max -= 1;
		if(min < 1) min = 1;
		if(max < 1) max = 1;
		for(var i = 0; i < 4; i ++) {
			var numBlanks = 0;
			for(var j = 0; j < 4; j ++) {
				if(grid[j+4][i] == 0) numBlanks ++;
			}
			for(var j = 0; j < numBlanks; j ++) {
				grid[3-j][i] = randInt(min,max);
			}
		}
		updateObjects();
		updateGrid();
		check();
	}
}

$(".object").click(function() {
	var x = $(this).data('x');
	var y = $(this).data('y');
	fold(x,y);
});

$(".game-button").click(function() {
	generateGrid();
	updateObjects();
	continued = false;
	$(".lose-overlay").fadeOut();
	$(".win-overlay").fadeOut();
});

$(".continue-button").click(function() {
	continued = true;
	$(".win-overlay").fadeOut();
});

$(".refresh-button").click(function() {
	generateGrid();
	updateObjects();
	continued = false;
	$(".lose-overlay").fadeOut();
	$(".win-overlay").fadeOut();
});

$(document).ready(function() {
	generateGrid();
	updateObjects();
});
