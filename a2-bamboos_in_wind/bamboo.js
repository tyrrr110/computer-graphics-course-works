function setup() {
    var canvas = document.getElementById("myCanvas");
    var range = document.getElementById("s");
    range.value = 1;
    var t = 0;
    var b = 0;
    var l1 = 0;
    var l2 = 1;
    var l3 = -1;
    var toRight_t = true;
    var toRight_b = true;
    var toRight_l1 = true;
    var toRight_l2 = true;
    var toRight_l3 = true;

    var context = canvas.getContext("2d");
    // var stack =[mat3.creat()];

    function clearUpdate() {
        t =0;
        b =0;
        l1 =0;
        l2 =1;
        l3 =-1;
        toRight_t = true;
        toRight_b = true;
        toRight_l1 = true;
        toRight_l2 = true;
        toRight_l3 = true;
    }

    function update(){
        if (toRight_t && t <0.5*range.value)
            t += 0.01*range.value;
        else if (toRight_t && t >=0.5*range.value) {
            toRight_t = false;
            t -= 0.01*range.value;
        } else if (!toRight_t && t >-0.5*range.value) 
            t -= 0.01*range.value;
        else {
            toRight_t = true;
            t += 0.01*range.value;
        }

        if (toRight_b && b <0.5*range.value)
            b += 0.01*range.value;
        else if (toRight_b && b >=0.5*range.value) {
            toRight_b = false;
            b -= 0.01*range.value;
        } else if (!toRight_b && b >-0.5*range.value) 
            b -= 0.01*range.value;
        else {
            toRight_b = true;
            b += 0.01*range.value;
        }

        if (toRight_l1 && l1 <1)
            l1 += 0.02*range.value;
        else if (toRight_l1 && l1 >=1) {
            toRight_l1 = false;
            l1 -= 0.02*range.value;
        } else if (!toRight_l1 && l1 >-1) 
            l1 -= 0.02*range.value;
        else {
            toRight_l1 = true;
            l1 += 0.02*range.value;
        }

        if (toRight_l2 && l2 <1)
            l2 += 0.04*range.value;
        else if (toRight_l2 && l2 >=1) {
            toRight_l2 = false;
            l2 -= 0.04*range.value;
        } else if (!toRight_l2 && l2 >-1) 
            l2 -= 0.04*range.value;
        else {
            toRight_l2 = true;
            l2 += 0.04*range.value;
        }

        if (toRight_l3 && l3 <1)
            l3 += 0.04*range.value;
        else if (toRight_l3 && l3 >=1) {
            toRight_l3 = false;
            l3 -= 0.04*range.value;
        } else if (!toRight_l3 && l3 >-1) 
            l3 -= 0.04*range.value;
        else {
            toRight_l3 = true;
            l3 += 0.04*range.value;
        }
        
    }
    
    function trunk(){
        context.fillStyle = "#95b391";
        context.fillRect(460,380,80,100);
        context.fillStyle = "#393737";
        context.fillRect(460,482,80,5); //leave a 2-pixel blank space
    }
    function branch(dir) {
        context.beginPath();
        context.fillStyle = "#393737";
        context.lineWidth = 3;
        if (dir=="l"){ //to the left
            context.moveTo(460,480);
            context.lineTo(420,440);
        } else if (dir=="r"){ //to the right
            context.moveTo(540,480);
            context.lineTo(580,440);
        }
        context.closePath();
        context.stroke();
    }
    function leaf(dir) {
        context.beginPath();
        context.fillStyle = "#355d39";
        context.lineWidth = 1.5;
        if (dir=="l") {
            context.arc(420,455,10,0,Math.PI,true); //radius = 10
            context.lineTo(420,510); // height = 55
            context.lineTo(430,455);
        } else if (dir=="r"){
            context.arc(580,455,10,Math.PI,Math.PI*2);
            context.lineTo(580,510);
            context.lineTo(570,455);
        }
        context.closePath();
        context.fill();
    }



    function draw(){
        window.requestAnimationFrame(draw);

        canvas.width=canvas.width;

        //prepare the context for drawing a branch
        function branchTrans(dir, s) {
            if (dir=="l"){
                context.translate(460,480);
                context.rotate(Math.PI/18*s);
                context.translate(-460,-480);
            } else if(dir=="r"){
                context.translate(540,480);
                context.rotate(Math.PI/18*s);
                context.translate(-540,-480);
            } 
        }
        //prepare the context for drawing a leaf
        function leafTrans(dir, s, sca){
            if (dir=="l"){
                context.translate(420,440);
                context.rotate(Math.PI/6*s);
                context.scale(sca, sca);
                context.translate(-420,-440);
            } else if(dir=="r"){
                context.translate(580,440);
                context.rotate(Math.PI/6*s);
                context.scale(sca, sca);
                context.translate(-580,-440);
            }
        }

        function leaf3(dir) {
            context.save();
            //draw three leaves
            leafTrans(dir,l1,1.2);
            leaf(dir);
            context.restore();
            context.save();
            leafTrans(dir,l2,1.1);
            leaf(dir);
            context.restore();
            leafTrans(dir,l3,1);
            leaf(dir);
        }

        function bamboo(){
            //draw bottom trunk
            context.translate(500,480);
            context.rotate(Math.PI/36*t);
            context.translate(-500,-480);
            trunk();
            context.save();
            //draw a left branch
            branchTrans("l",b);
            branch("l");
            leaf3("l");
            context.restore();

            //draw mid-bottom trunk
            context.translate(500,480-110);
            context.rotate(Math.PI/36*t);
            context.scale(0.9,1);
            context.translate(-500,-480);
            trunk();
            context.save();
            //draw a right branch
            branchTrans("r",b);
            branch("r");
            leaf3("r");
            context.restore();

            //draw mid-top trunk
            context.translate(500,480-110);
            context.rotate(Math.PI/36*t);
            context.scale(0.9,1);
            context.translate(-500,-480);
            trunk();
            context.save();
            //draw a left branch
            branchTrans("l",b);
            branch("l");
            leaf3("l");
            context.restore();

            //draw top trunk
            context.translate(500,480-110);
            context.rotate(Math.PI/36*t);
            context.scale(0.9,1);
            context.translate(-500,-480);
            trunk();
            context.save();
            //draw a right branch
            branchTrans("r",b);
            branch("r");
            leaf3("r");
            context.restore();
        }

        context.save();
        bamboo();
        context.restore();
        context.save();
        context.translate(-250,0);
        bamboo();
        context.restore();
        context.translate(250,0);
        bamboo();

        update();
    }
    draw();
    range.addEventListener("input", clearUpdate);
}

window.onload=setup;