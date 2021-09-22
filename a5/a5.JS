function setup(){
    var canvas = document.getElementById("myCanvas");
    var context = canvas.getContext("2d");
    var slider = document.getElementById("mySlider");
    slider.value = 0;

    var flutterOffset = 30.0; // a changing angle between 30-60 degrees
    var butterflyPos = 0.0; // a changing angle on x-z plane, from 0 to -2PI
    var butterflyY = 0.0; // form -50 to -150, Y-axis value of butterflyPos
    var increaseY = true;
    var increaseF = true;

    function draw(){
        canvas.width = canvas.width; //clear canvas instances before drawing
        var cameraAngle = slider.value/360.0*2*Math.PI;

        function moveToTx(loc, Tx)
        {var res = vec3.create(); vec3.transformMat4(res,loc,Tx); context.moveTo(res[0],res[1]);}
        function lineToTx(loc, Tx)
        {var res = vec3.create(); vec3.transformMat4(res,loc,Tx); context.lineTo(res[0],res[1]);}

        function draw3DAxes(color,TxU,scale) {
            var Tx = mat4.clone(TxU);
            mat4.scale(Tx,Tx,[scale,scale,scale]);
    
            context.strokeStyle=color;
            context.beginPath();
            // Axes
            moveToTx([1.2,0,0],Tx);lineToTx([0,0,0],Tx);lineToTx([0,1.2,0],Tx);
            moveToTx([0,0,0],Tx);lineToTx([0,0,1.2],Tx);
            // Arrowheads
            moveToTx([1.1,.05,0],Tx);lineToTx([1.2,0,0],Tx);lineToTx([1.1,-.05,0],Tx);
            moveToTx([.05,1.1,0],Tx);lineToTx([0,1.2,0],Tx);lineToTx([-.05,1.1,0],Tx);
              moveToTx([.05,0,1.1],Tx);lineToTx([0,0,1.2],Tx);lineToTx([-.05,0,1.1],Tx);
            // X-label
            moveToTx([1.3,-.05,0],Tx);lineToTx([1.4,.05,0],Tx);
            moveToTx([1.3,.05,0],Tx);lineToTx([1.4,-.05,0],Tx);
            // Y-label
            moveToTx([-.05,1.4,0],Tx);lineToTx([0,1.35,0],Tx);lineToTx([.05,1.4,0],Tx);
            moveToTx([0,1.35,0],Tx);lineToTx([0,1.28,0],Tx);
            // Z-label
            moveToTx([-.05,0,1.3],Tx);
            lineToTx([.05,0,1.3],Tx);
            lineToTx([-.05,0,1.4],Tx);
            lineToTx([.05,0,1.4],Tx);
    
            context.stroke();
        }
        var Hermite = function(t) {
            return [
                2*t*t*t-3*t*t+1,
                t*t*t-2*t*t+t,
                -2*t*t*t+3*t*t,
                t*t*t-t*t
                ];
        }
        function Cubic(basis,P,t){
            var b = basis(t);
            var res = vec3.create();
            // vec3.ScaleAndAdd
            vec3.scale(res, P[0], b[0]);
            vec3.scaleAndAdd(res, res, P[1], b[1]);
            vec3.scaleAndAdd(res, res, P[2], b[2]);
            vec3.scaleAndAdd(res, res, P[3], b[3]);
            return res;
        }

        var p0=[-30,30,0];
	    var d0_0=[-30,30,0];
	    var p1=[-50,35,0];
        var d1=[30,-50,0];
        var d0_1=[10,400,0];
	    var p2=[30,90,0];
        var d2=[200,-100,0];
        var p3=[30,30,0];
        var d3_0=[-50,-50,0];
        var d3_1=[30,20,0];
        var p4=[65,10,0];
        var d4=[5,-150,0];
        var p5=[30,-30,0];
        var d5=[-100,30,0];

        var P0 = [p0,d0_0,p1,d1]; // tentacle
        var P1 = [p0,d0_1,p2,d2]; // wing1
        var P2 = [p2,d2,p3,d3_0]; // wing2
        var P3 = [p3,d3_1,p4,d4]; // wing3
        var P4 = [p4,d4,p5,d5]; // wing4

        var C0 = function(t_) {return Cubic(Hermite,P0,t_);};
        var C1 = function(t_) {return Cubic(Hermite,P1,t_);};
        var C2 = function(t_) {return Cubic(Hermite,P2,t_);};
        var C3 = function(t_) {return Cubic(Hermite,P3,t_);};
        var C4 = function(t_) {return Cubic(Hermite,P4,t_);};
        
        function updateBtflyHeight(){
            if (increaseY&&butterflyY<150.0)
                butterflyY+=1;
            else if (increaseY&&butterflyY>=150.0){
                increaseY = false;
                butterflyY-=1;
            }
            else if (!increaseY&&butterflyY>-50.0)
                butterflyY-=1;
            else if (!increaseY&&butterflyY<=-50.0){
                increaseY = true;
                butterflyY+=1;
            }
        }

        function updateBtflyPosAngle(){
            if (butterflyPos>-360.0)
                butterflyPos-=0.15;
            else
            // the animation is somehow lagged when butterflyPos=-360, so instead of 
            // resetting to 0.0, here sets to -3.60 trying to catch up the lag
                butterflyPos=-3.60; 
        }

        function updateFlutterAngle(){
            if(increaseF&&flutterOffset<60.0)
                flutterOffset+=3;
            else if (increaseF&&flutterOffset>=60.0){
                flutterOffset-=3;
                increaseF=false;
            }
            else if (!increaseF&&flutterOffset>30.0)
                flutterOffset-=3;
            else if (!increaseF&&flutterOffset<=30.0){
                flutterOffset+=3;
                increaseF=true;
            }
        }
        
        //return a triple of the center of butterfly coordinate
        var butterflyCenter = function(){
            var dist = 200.0;
            var center = vec3.create();
            center[0] = dist*Math.sin(butterflyPos/(2*Math.PI));
            center[1] = butterflyY;
            center[2] = dist*Math.cos(butterflyPos/(2*Math.PI));
            return [center[0],center[1],center[2]];
        }

        //return a triple of camera eye loc
        var cameraEye =function(){
            var dist = 500.0;
            var eye = vec3.create();
            eye[0] = dist*Math.sin(cameraAngle);
            eye[1] = 150.0;
            eye[2] = dist*Math.cos(cameraAngle);
            return [eye[0],eye[1],eye[2]];
        }

        function drawCurve(t_begin, t_end, intervals, C, Tx, color){
            context.strokeStyle = color;
            context.beginPath();
            moveToTx(C(t_begin),Tx);
            for(var i=1;i<=intervals;i++){
                var t=((intervals-i)/intervals)*t_begin+(i/intervals)*t_end;
                lineToTx(C(t),Tx);
            }
            context.stroke();
        }

        function traceCurve(t_begin, t_end, intervals, C, Tx){
            // moveToTx(C(t_begin),Tx);
            for(var i=1;i<=intervals;i++){
                var t=((intervals-i)/intervals)*t_begin+(i/intervals)*t_end;
                lineToTx(C(t),Tx);
            }
        }

        function drawWing(fillColor, Tx){
            context.fillStyle = fillColor;
            moveToTx(p0,Tx);
            context.beginPath();
            traceCurve(0.0,1.0,100,C1,Tx);
            traceCurve(0.0,1.0,100,C2,Tx);
            traceCurve(0.0,1.0,100,C3,Tx);
            traceCurve(0.0,1.0,100,C4,Tx);
            context.closePath();
            context.fill();
        }

        //Camera(lookAt) transform
        var TlookAtCamera = mat4.create();
        var eyeCamera = cameraEye();
        var targetCamera = vec3.fromValues(0,50,0);
        var upCamera = vec3.fromValues(0,1,0);
        mat4.lookAt(TlookAtCamera,eyeCamera,targetCamera,upCamera);

        //Viewport transform
        var Tviewport = mat4.create();
        mat4.fromTranslation(Tviewport,[300,300,0]);
        mat4.scale(Tviewport, Tviewport, [150,-150,1]);
        
        //Prjection transform
        var Tprojection = mat4.create();
        mat4.perspective(Tprojection,Math.PI/3,1,-1,1);
        //mat4.ortho(Tprojection,-150,150,-150,150,-1,1);

        //combine Viewport_Projection_lookAt
        var tVP_PROJ_LOOKAT = mat4.create();
        mat4.multiply(tVP_PROJ_LOOKAT, Tviewport, Tprojection);
        mat4.multiply(tVP_PROJ_LOOKAT, tVP_PROJ_LOOKAT, TlookAtCamera);

        //Modeling transform 
        var Tmodel = mat4.create();
        var butterflyCoor = butterflyCenter(); 
        mat4.fromTranslation(Tmodel, butterflyCoor);
        mat4.rotateY(Tmodel, Tmodel, butterflyPos/(2*Math.PI)); 
        //Modeling transforms that duplicate the wing
        var TmodelWings = mat4.clone(Tmodel);
        mat4.rotateZ(TmodelWings, TmodelWings, -Math.PI/4);
        var TmodelWing1 =mat4.create();
        var TmodelWing2 =mat4.create();
        mat4.rotateX(TmodelWing1, TmodelWings, flutterOffset*Math.PI/180);
        mat4.rotateX(TmodelWing2, TmodelWings, -flutterOffset*Math.PI/180);
        mat4.rotateZ(TmodelWing1, TmodelWing1, Math.PI/4);
        mat4.rotateZ(TmodelWing2, TmodelWing2, Math.PI/4);

        //combine tVP_PROJ_LOOKAT and Modeling transforms
        var tVP_PROJ_LOOKAT_MODEL = mat4.create();
        mat4.multiply(tVP_PROJ_LOOKAT_MODEL,tVP_PROJ_LOOKAT,Tmodel);
        var tVP_PROJ_LOOKAT_MODEL_Wing1 = mat4.create();
        var tVP_PROJ_LOOKAT_MODEL_Wing2 = mat4.create();
        var tVP_PROJ_LOOKAT_MODEL_Wings = mat4.create();
        mat4.multiply(tVP_PROJ_LOOKAT_MODEL_Wing1,tVP_PROJ_LOOKAT,TmodelWing1);
        mat4.multiply(tVP_PROJ_LOOKAT_MODEL_Wing2,tVP_PROJ_LOOKAT,TmodelWing2);
        mat4.multiply(tVP_PROJ_LOOKAT_MODEL_Wings,tVP_PROJ_LOOKAT,TmodelWings);

        //a normal vector pointing outward from the front side of the butterfly
        var tLOOKAT_MODEL = mat4.create();
        mat4.multiply(tLOOKAT_MODEL, TlookAtCamera, Tmodel);
        var normalVectorFront = vec3.fromValues(0,0,1); 
        var worldOrgin = vec3.fromValues(0,0,0);
        vec3.transformMat4(normalVectorFront,normalVectorFront,tLOOKAT_MODEL);
        vec3.transformMat4(worldOrgin,worldOrgin,TlookAtCamera);
        
        //draw objects on camera window
        if ((normalVectorFront[2]-worldOrgin[2])<0) {// camera is facing the backside(green) of butterfly
            drawCurve(0.0,1.0,100,C0,tVP_PROJ_LOOKAT_MODEL_Wing1,"black");
            drawCurve(0.0,1.0,100,C0,tVP_PROJ_LOOKAT_MODEL_Wing2,"black");
            drawWing("#f7d6bf",tVP_PROJ_LOOKAT_MODEL_Wing1);
            drawWing("#b0cac7",tVP_PROJ_LOOKAT_MODEL_Wing2);
            context.strokeStyle = "black";
            context.beginPath();
            moveToTx([-30,30,0],tVP_PROJ_LOOKAT_MODEL);
            lineToTx([35,-35,0],tVP_PROJ_LOOKAT_MODEL);
            context.stroke();
            draw3DAxes("grey",tVP_PROJ_LOOKAT,150.0);
        } else {
            draw3DAxes("grey",tVP_PROJ_LOOKAT,150.0);
            drawCurve(0.0,1.0,100,C0,tVP_PROJ_LOOKAT_MODEL_Wing1,"black");
            drawCurve(0.0,1.0,100,C0,tVP_PROJ_LOOKAT_MODEL_Wing2,"black");
            drawWing("#b0cac7",tVP_PROJ_LOOKAT_MODEL_Wing2);
            drawWing("#f7d6bf",tVP_PROJ_LOOKAT_MODEL_Wing1);
            context.strokeStyle = "black";
            context.beginPath();
            moveToTx([-30,30,0],tVP_PROJ_LOOKAT_MODEL);
            lineToTx([35,-35,0],tVP_PROJ_LOOKAT_MODEL);
            context.stroke();
        }

        window.requestAnimationFrame(draw);
        updateBtflyHeight();
        updateBtflyPosAngle();
        updateFlutterAngle();
         
    }
    // slider.addEventListener("input",draw);
    draw();
}
window.onload = setup;