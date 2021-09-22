function setup() {
    var canvas = document.getElementById("myCanvas");
    var slider = document.getElementById("mySlider");
    slider.value=0;
    var context = canvas.getContext("2d");
    // var t = 0.0; // UNBLOCK THIS FOR automatic animation

    function draw(){
        var t = slider.value*0.005;

        context.fillStyle = "#eaf0fb";
        context.fillRect(0, 0, canvas.width, 400);
        context.fillStyle = "#001f2b";
        context.fillRect(0, 400, canvas.width, canvas.height);

        function lineToTx(loc, Tx){
            var res = vec2.create();
            vec2.transformMat3(res, loc, Tx);
            context.lineTo(res[0],res[1]);
        }

        function moveToTx(loc, Tx) {
            var res = vec2.create();
            vec2.transformMat3(res, loc, Tx);
            context.moveTo(res[0],res[1]);
        }

        var C0 = function(t){ // 0 <= t < 2
            var x = Math.sqrt(2*t);
            var y = 2*t;
            return [x,y];
        }

        var C1 = function(t){ // 2 <= t < 4
            var x = 0.5*t+1;
            var y = 2*t+(2-t)*(2-t)*(2-t);
            return [x,y];
        }

        var C2 = function(t){ // 4 <= t < 6
            var x = t*0.5+1;
            var y = -20*Math.sin(t/2*Math.PI)/Math.PI;
            return [x,y];
        }

        //tangent functions
        var CT0 = function(t){
            var x = 1/Math.sqrt(2*t);
            return [x,2];
        }

        var CT1 = function(t){
            var y = 2-3*(2-t)*(2-t);
            return [0.5,y];
        }

        var CT2 = function(t){
            var y = -10*Math.cos(t/2*Math.PI);
            return [0.5,y];
        }

        var Ccomp = function(t){
            if (t >= 0 && t < 2)
                return C0(t);
            else if (t >= 2 && t < 4)
                return C1(t);
            else if (t >= 4 && t < 6)
                return C2(t);
            else if (t >= 6 && t < 8) {
                var res = C2(12-t);
                return [res[0], res[1]*(-1)];
            }
            else if (t >= 8 && t < 10) {
                var res = C1(12-t);
                return [res[0], res[1]*(-1)];
            }
            else {
                var res = C0(12-t);
                return [res[0], res[1]*(-1)];
            }
        }

        var CTcomp = function(t){
            if (t >= 0 && t < 2)
                return CT0(t);
            else if (t >= 2 && t < 4)
                return CT1(t);
            else if (t >= 4 && t < 6)
                return CT2(t);
            else if (t >= 6 && t < 8) {
                var res = CT2(12-t);
                return [res[0]*(-1), res[1]];
            }
            else if (t >= 8 && t < 10) {
                var res = CT1(12-t);
                return [res[0]*(-1), res[1]];
            }
            else {
                var res = CT0(12-t);
                return [res[0]*(-1), res[1]];
            }
        }

        function drawPiece(t_begin, interval, Tx, color){
            context.beginPath();
            context.lineWidth = 2;
            context.strokeStyle = color;
            moveToTx(Ccomp(t_begin), Tx);
            for (var i =0; i <= interval; i++) 
                lineToTx(Ccomp(t_begin+2*i/interval), Tx);
            context.stroke();
        }

        function drawObject(Tx, color){
            context.fillStyle = color;
            context.beginPath();
            moveToTx([-0.05, -0.5], Tx);
            lineToTx([-0.05, 0.5], Tx);
            lineToTx([0.1, 0], Tx);
            context.closePath();
            context.fill();
        }

        var currCanvas = mat3.create();
        mat3.fromTranslation(currCanvas, [100,400]);
        mat3.scale(currCanvas, currCanvas, [150, -10]);
        drawPiece(0,100,currCanvas, "#318fb5");
        drawPiece(2,100,currCanvas, "#005086");
        drawPiece(4,100,currCanvas, "#b7b3a9");
        drawPiece(6,100,currCanvas, "#001244");
        drawPiece(8,100,currCanvas, "#b0cac7");
        drawPiece(10,100,currCanvas, "#f7d6bf");

        var arrowCanvas = mat3.create();
        var tangent = CTcomp(t);
        var angle = Math.atan2(tangent[1],15*tangent[0]);
        mat3.fromTranslation(arrowCanvas, [100,400]);
        mat3.scale(arrowCanvas, arrowCanvas, [1, -1]);
        var translation = Ccomp(t);
        vec2.multiply(translation, translation, [150,10]);
        mat3.translate(arrowCanvas, arrowCanvas, translation);
        mat3.rotate(arrowCanvas, arrowCanvas, angle);
    
        mat3.scale(arrowCanvas, arrowCanvas, [150, 10]);
        drawObject(arrowCanvas, "#6694f6");

        // Somehow the automatic animation generates low-pixel curves so I use a slider instead. UNBLOCK BELOW FOR automatic animation:

        // window.requestAnimationFrame(draw);
        // if (t < 12)
        //     t+=0.02;
        // else 
        //     t = 0.0;
    }
    draw();
    slider.addEventListener("input", draw); // BLOCK THIS FOR automatic animation
}
window.onload = setup;