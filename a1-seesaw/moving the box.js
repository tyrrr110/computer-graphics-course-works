function setup() {
    var canvas = document.getElementById('myCanvas');
    var slider1 = document.getElementById('slider1');
    slider1.value = 0;
    var slider2 = document.getElementById('slider2');
    slider2.value = 0;

	function draw() {
		var context = canvas.getContext('2d');
		canvas.width = canvas.width;
		var dx = slider1.value;
		var dy = slider2.value;

		function drawPath(color) {
			context.beginPath();
			context.moveTo(0,0);
			context.lineTo(220,0);
			context.lineTo(220,200);
			context.lineTo(420,200);
			context.moveTo(0,20);
			context.lineTo(200,20);
			context.lineTo(200,220);
			context.lineTo(420,220);
			context.strokeStyle=color;
			context.stroke();
		}
		drawPath("#808");
		context.translate(dx,dy);
		context.fillRect(0,5,10,10);
	}
	draw();
	slider1.addEventListener("input",draw);
	slider2.addEventListener("input",draw);

}
window.onload=setup;