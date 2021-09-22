function setup(){
	var canvas = document.getElementById('myCanvas');
	var slider = document.getElementById('slider');
	slider.value = 200;

	function draw(){
		var context = canvas.getContext('2d');
		canvas.width = canvas.width; //clear the canvas on each draw
		var movement = slider.value;

		function drawPlank(){
			context.fillStyle = "#809";
			context.fillRect(20,120,400,20);
		}

		function drawBase(){
			context.fillStyle = "#119";
			context.beginPath();
			context.moveTo(220,140);
			context.lineTo(240,180);
			context.lineTo(200,180);
			context.closePath();
			context.fill();
		}

		function drawBall() {	
			context.beginPath();
			context.arc(20,110,10,0,Math.PI*2,true);
			context.lineWidth = 2.5;
			context.stroke();
		}
		drawBase();
		context.translate(220,130);
		context.rotate((movement-200)/200*Math.PI/12);
		context.translate(-220,-130);
		drawPlank();
		context.translate(movement,0);
		drawBall();
	}
	draw();
	slider.addEventListener("input",draw);
}
window.onload =setup;