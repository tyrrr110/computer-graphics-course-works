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
    var stack;

    //reset parameters(start over) when slider value changes
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
        stack = [mat3.create()];
    }

    //update parameters each frame to create animation effects
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
    
    //draw a trunk of a bamboo
    function trunk(){
        context.setTransform(stack[0][0],stack[0][1],stack[0][3],stack[0][4],stack[0][6],stack[0][7]);
        context.fillStyle = "#95b391";
        context.fillRect(460,380,80,100);
        context.fillStyle = "#393737";
        context.fillRect(460,482,80,5); //leave a 2-pixel blank space
    }
    //draw a branch of a bamboo
    function branch(dir) {
        context.setTransform(stack[0][0],stack[0][1],stack[0][3],stack[0][4],stack[0][6],stack[0][7]);
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
    //draw a leaf of a bamboo
    function leaf(dir) {
        context.setTransform(stack[0][0],stack[0][1],stack[0][3],stack[0][4],stack[0][6],stack[0][7]);
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
        stack =[mat3.create()];
        canvas.width=canvas.width;

        //prepare the context for drawing a branch
        function branchTrans(dir, s) {
            var tx = mat3.create();
            var theta = Math.PI/18*s;
            if (dir=="l"){
                mat3.fromTranslation(tx,[460,480]);//context.translate(460,480);
                mat3.rotate(tx,tx,theta);//context.rotate(Math.PI/18*s);
                mat3.translate(tx,tx,[-460,-480]);//context.translate(-460,-480);
            } else if(dir=="r"){
                mat3.fromTranslation(tx,[540,480]);//context.translate(540,480);
                mat3.rotate(tx,tx,theta);//context.rotate(Math.PI/18*s);
                mat3.translate(tx,tx,[-540,-480]);//context.translate(-540,-480);
            }
            mat3.multiply(stack[0],stack[0],tx);
        }
        //prepare the context for drawing a leaf
        function leafTrans(dir, s, sca){
            var tx = mat3.create();
            var theta = Math.PI/6*s;
            if (dir=="l"){
                mat3.fromTranslation(tx,[420,440]);//context.translate(420,440);
                mat3.rotate(tx,tx,theta);//context.rotate(Math.PI/6*s);
                mat3.scale(tx,tx,[sca,sca]);//context.scale(sca, sca);
                mat3.translate(tx,tx,[-420,-440]);//context.translate(-420,-440);
            } else if(dir=="r"){
                mat3.fromTranslation(tx,[580,440]);//context.translate(580,440);
                mat3.rotate(tx,tx,theta);//context.rotate(Math.PI/6*s);
                mat3.scale(tx,tx,[sca,sca]);//context.scale(sca, sca);
                mat3.translate(tx,tx,[-580,-440]);//context.translate(-580,-440);
            }
            mat3.multiply(stack[0],stack[0],tx);
        }
        //prepare the context for drawing a trunk
        function trunkTrans(){
            var tx = mat3.create();
            var theta = Math.PI/36*t;
            mat3.fromTranslation(tx,[500,480-110]);//context.translate(500,480-110);
            mat3.rotate(tx,tx,theta);//context.rotate(Math.PI/36*t);
            mat3.scale(tx,tx,[0.9,1]);//context.scale(0.9,1);
            mat3.translate(tx,tx,[-500,-480]);//context.translate(-500,-480);
            mat3.multiply(stack[0],stack[0],tx);
        }

        //draw three leaves
        function leaf3(dir) {
            stack.unshift(mat3.clone(stack[0]));//context.save();
            leafTrans(dir,l1,1.2);
            leaf(dir);
            stack.shift();//context.restore();
            stack.unshift(mat3.clone(stack[0]));//context.save();
            leafTrans(dir,l2,1.1);
            leaf(dir);
            stack.shift();//context.restore();
            leafTrans(dir,l3,1);
            leaf(dir);
        }

        //draw a bamboo
        function bamboo(){
            //draw bottom trunk
            var tx = mat3.create();
            var theta = Math.PI/36*t;
            mat3.fromTranslation(tx,[500,480]);//context.translate(500,480);
            mat3.rotate(tx,tx,theta);//context.rotate(Math.PI/36*t);
            mat3.translate(tx,tx,[-500,-480]);//context.translate(-500,-480);
            mat3.multiply(stack[0],stack[0],tx);
            trunk();
            stack.unshift(mat3.clone(stack[0])); //context.save();
            //draw a left branch
            branchTrans("l",b);
            branch("l");
            leaf3("l");
            stack.shift(); //context.restore();

            //draw mid-bottom trunk
            trunkTrans();
            trunk();
            stack.unshift(mat3.clone(stack[0])); //context.save();
            //draw a right branch
            branchTrans("r",b);
            branch("r");
            leaf3("r");
            stack.shift(); //context.restore();

            //draw mid-top trunk
            trunkTrans();
            trunk();
            stack.unshift(mat3.clone(stack[0])); //context.save();
            //draw a left branch
            branchTrans("l",b);
            branch("l");
            leaf3("l");
            stack.shift(); //context.restore();

            //draw top trunk
            trunkTrans();
            trunk();
            stack.unshift(mat3.clone(stack[0])); //context.save();
            //draw a right branch
            branchTrans("r",b);
            branch("r");
            leaf3("r");
            stack.shift();//context.restore();
        }

        //draw three bamboos
        stack.unshift(mat3.clone(stack[0]));//context.save();
        bamboo();
        stack.shift();//context.restore();
        stack.unshift(mat3.clone(stack[0]));//context.save();
        mat3.translate(stack[0],stack[0],[-250,0]);//context.translate(-250,0);
        bamboo();
        stack.shift();//context.restore();
        mat3.translate(stack[0],stack[0],[250,0]);//context.translate(250,0);
        bamboo();

        update();
    }
    draw();
    range.addEventListener("input", clearUpdate);
}

window.onload=setup;