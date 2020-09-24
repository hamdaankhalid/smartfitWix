
// **************** SECTION 1 ****************

// User Height Input
var height;
var heightgiven = false;
document.getElementById("frontfile").disabled = true;
document.getElementById("sideFile").disabled = true;
document.getElementById("backFile").disabled = true;
document.getElementById("frontfilelabel").innerHTML = "Enter Height Above";
document.getElementById("sidefilelabel").innerHTML = "Enter Height Above";
document.getElementById("backfilelabel").innerHTML = "Enter Height Above";

var heightEntry = document.getElementById('height');

heightEntry.addEventListener("change", function(){
    height = document.getElementById('height').value;
    heightgiven = true;
    document.getElementById("frontfile").disabled = false;
    document.getElementById("sideFile").disabled = false;
    document.getElementById("backFile").disabled = false;
	document.getElementById("frontfilelabel").innerHTML = "Choose Front Image";
	document.getElementById("sidefilelabel").innerHTML = "Choose Side Image";
	document.getElementById("backfilelabel").innerHTML = "Choose Back image";
});

// FILE IMAGE INPUT AND PREPROCESSING ON CANVASES
var canvasFront = document.getElementById('mycanvas');
var canvasSide = document.getElementById('mycanvasSide');
var canvasBack = document.getElementById('mycanvasBack');

var frontFile = document.getElementById("frontfile");
var sideFile = document.getElementById("sideFile");
var backFile = document.getElementById("backFile");
    
// Function that scales Image on canvas
var fitImageOn = function(canvas, imageObj) {
	var imageAspectRatio = imageObj.width / imageObj.height;
	var canvasAspectRatio = canvas.width / canvas.height;
	var renderableHeight, renderableWidth, xStart, yStart;
    var context = canvas.getContext('2d');
	// If image's aspect ratio is less than canvas's we fit on height
	// and place the image centrally along width
	if(imageAspectRatio < canvasAspectRatio) {
		renderableHeight = canvas.height;
		renderableWidth = imageObj.width * (renderableHeight / imageObj.height);
		xStart = (canvas.width - renderableWidth) / 2;
		yStart = 0;
	}

	// If image's aspect ratio is greater than canvas's we fit on width
	// and place the image centrally along height
	else if(imageAspectRatio > canvasAspectRatio) {
		renderableWidth = canvas.width
		renderableHeight = imageObj.height * (renderableWidth / imageObj.width);
		xStart = 0;
		yStart = (canvas.height - renderableHeight) / 2;
	}

	// Happy path - keep aspect ratio
	else {
		renderableHeight = canvas.height;
		renderableWidth = canvas.width;
		xStart = 0;
		yStart = 0;
    }
    
    canvas.height
	context.drawImage(imageObj, xStart, yStart, renderableWidth, renderableHeight);
};

var URL = window.webkitURL || window.URL;

  
 var redrawFrontImage = new Image();
 redrawFrontImage.crossOrigin = "anonymous";

 var redrawSideImage = new Image();
 redrawSideImage.crossOrigin = "anonymous";

 var redrawBackImage = new Image();
 redrawBackImage.crossOrigin = "anonymous";

// Front Image  File Input 
frontFile.addEventListener('change', handleFrontFile);

function handleFrontFile(e) {
    if(heightgiven==true){
        var reader  = new FileReader();
    var file = e.target.files[0];
    // load to image to get it's width/height
    var img = new Image();

    img.onload = function() {

        // // scale canvas to image
        // ctx.canvas.width = img.width;
        // ctx.canvas.height = img.height;

        // draw image
        // Call AI FUNCTION TO CLEAR BACKGROUND?
        
        fitImageOn(canvasFront,img);
        recalibfirst();

    }

    // this is to setup loading the image
    reader.onloadend = function () {
        img.src = reader.result;
        // store the image src in redrawFrontImage so we can use this to draw the image in redraw function
        redrawFrontImage.src = reader.result;
    }
    // this is to read the file
   	reader.readAsDataURL(file);
    }
    else{
        window.alert("Please Enter Client's Height Before Uploading Image");
    }
    
}


// Side Image  File Input 

sideFile.addEventListener('change',handleSideFile);
function handleSideFile(e) {
    if(heightgiven==true){
    var reader  = new FileReader();
    var file = e.target.files[0];
    // load to image to get it's width/height
    var img = new Image();

    img.onload = function() {

        // // scale canvas to image
        // ctx.canvas.width = img.width;
        // ctx.canvas.height = img.height;

        // draw image
        fitImageOn(canvasSide, img);
        recalibsecond();
    }

    // this is to setup loading the image
    reader.onloadend = function () {
        img.src = reader.result;
        redrawSideImage.src = reader.result;
    }
    // this is to read the file
       reader.readAsDataURL(file);
    }
        else{
            window.alert("Please Enter Client's Height Before Uploading Image");
    }
}

// Back Image  File Input 
backFile.addEventListener('change',handleBackFile, false);

function handleBackFile(e) {
    if(heightgiven){
        var reader  = new FileReader();
    var file = e.target.files[0];
    // load to image to get it's width/height
    var img = new Image();

    img.onload = function() {

        // // scale canvas to image
        // ctx.canvas.width = img.width;
        // ctx.canvas.height = img.height;

        // draw image
        fitImageOn(canvasBack, img);
        recalibthird();
    }

    // this is to setup loading the image
    reader.onloadend = function () {
        img.src = reader.result;
        redrawBackImage.src = reader.result;
    }
    // this is to read the file
   	reader.readAsDataURL(file);
    }else{
        window.alert("Please Enter Client's Height Before Uploading Image");
    }
    
}

// **************** SECTION 1 END ****************


// **************** FUNCIONALTY FOR AI BACKGROUND REMOVAL ************
// *** We will use this section in section 1 to pass the image with masked background in fitImage section
// Takes in an image, segments the person and returns 
    async function predictSegment(img, canvas) {

        const net = await bodyPix.load({
            architecture: 'MobileNetV1',
  outputStride: 16,
  multiplier: 0.75,
  quantBytes: 1
    });
        const personSegmentation = await net.segmentPerson(img, {
            flipHorizontal: false,
            internalResolution: 'medium',
            segmentationThreshold: 0.7
        });
    
        const invertMask = false;
        const maskImage = bodyPix.toMask(personSegmentation, invertMask);
        const opacity = 0.8;
        const flipHorizontal = false;
        const maskBlurAmount = 0;

        bodyPix.drawMask(
            canvas, img, maskImage, opacity, maskBlurAmount,
            flipHorizontal);

      }
// ********************************************************************

// *********** CANVAS DRAWIGN AND MEASURING SECTION *************

// See where the boolean input getcircum is set at
var getcircum = false;
document.getElementById("lenorcircum").addEventListener('click', function(){
    getcircum = document.getElementById("lenorcircum").checked ;
    redoFunc();
    console.log(getcircum);
})

// this is the array you push key value pairs to after confirmation
var measurements = []

// this is the array you push the 3 tempLens to before you use them for circumference function
//       if TOGGLE BUTTON is set to circumference instead of default length
var circumArray = { 
    frontmeasure: -1,
     sidemeasure: -1,
      backmeasure: -1,
    };

// *********** DRAWING ON FRONT CANVAS FUNCTIONS *****************
var tempLen=0;
var calib_counter = 0;
var md = false;
var contextFront = canvasFront.getContext("2d");


canvasFront.addEventListener('mousedown', 
function(evt){
    if (redrawFrontImage.src != ""){
        md = true;
    //console.log("DOWN")
    startpos = getMousePos(canvasFront, evt);
    drawmarker(contextFront, startpos.x, startpos.y);
    }else{
        window.alert("Please Upload Front Facing Image Before Measuring");
    }
    
});

canvasFront.addEventListener('mouseup', 
function toggledraw(evt){
    md = false;
    console.log("UP")
    endpos = getMousePos(canvasFront, evt);
    drawmarker(contextFront, endpos.x, endpos.y);
    draw(contextFront, startpos, endpos);  

    if (calib_counter == 0){
        dist = getDistance(startpos, endpos);

        scale_factor = height / dist;
        inches_distance = scale_factor * dist;

        console.log(inches_distance);
        
        if ( window.confirm("click 'ok' if calibration was correct. Click 'cancel' to redo calibration") ) {
            window.alert("Caliberation Complete, You can now start measuring")
            setTimeout(() => {  redraw(); }, 500);
            calib_counter += 1;
          } else {
            redraw();
            calib_counter = 0;
          }
        
    }
    else{
        dist = getDistance(startpos, endpos);

        inches_distance = scale_factor * dist;

        console.log(inches_distance);
        tempLen = inches_distance.toFixed(2);
        if(getcircum == false){
            // if 2d length selected do single measurement
        // Show measurement on the screen
        document.getElementById('templenview').innerHTML = tempLen;
        }
        
        // else if 3d circumference selected push tempLen to circum dict 
        else{
            circumArray["frontmeasure"] = tempLen;
             // check if circumArray has 3 elements that are not -1 if yes then measure 
            if (circumArray["sidemeasure"] != -1 & circumArray["backmeasure"] != -1){
                var y = ( Math.max(circumArray["frontmeasure"], circumArray["backmeasure"] ) ) / 2;
                var x = circumArray["sidemeasure"]/ 2;

                var circumferenceRes = circumference(y,x);
                document.getElementById('templenview').innerHTML = circumferenceRes;
                // Show measurement on the screen
            }

          
        }
  
        
    }

});

// ***********************************************************************


// *********** DRAWING ON SIDE CANVAS FUNCTIONS *****************
var tempLen2 = 0;
var calib_counter2 = 0;
var md2 = false;
var contextSide = canvasSide.getContext("2d");

canvasSide.addEventListener('mousedown', 
function(evt){
    if (redrawSideImage.src != ""){
        md2 = true;
    //console.log("DOWN")
    startpos = getMousePos(canvasSide, evt);
    drawmarker(contextSide, startpos.x, startpos.y);
    }else{
        window.alert("Please Upload Side Facing Image Before Measuring");
    }
    
});

canvasSide.addEventListener('mouseup', 
function toggledraw(evt){
    md2 = false;
    console.log("UP")
    endpos = getMousePos(canvasSide, evt);
    drawmarker(contextSide, endpos.x, endpos.y);
    draw(contextSide, startpos, endpos);  

    if (calib_counter2 == 0){
        dist2 = getDistance(startpos, endpos);

        scale_factor2 = height / dist2;
        inches_distance2 = scale_factor2 * dist2;

        console.log(inches_distance2);

        if (window.confirm("click 'ok' if calibration was correct. Click 'cancel' to redo calibration")) {
            window.alert("Caliberation Complete, You can now start measuring")
            setTimeout(() => {  redraw(); }, 500);

            calib_counter2 += 1;
          } else {
            redraw();  
            calib_counter2 = 0;
          }

        
        
    }
    else{
        dist2 = getDistance(startpos, endpos);

        inches_distance2 = scale_factor2 * dist2;

        console.log(inches_distance2);
        
        tempLen2 = inches_distance2.toFixed(2);
        // if 2d length selected do single measurement
        if(getcircum == false){
            // Show measurement on the screen
            document.getElementById('templenview').innerHTML = tempLen2;
        }
        
        // else if 3d circumference selected push tempLen to circum dict 
        else{
            
            circumArray["sidemeasure"] = tempLen2;
             // check if circumArray has 3 elements that are not -1 if yes then measure 
             if (circumArray["frontmeasure"] != -1 & circumArray["backmeasure"] != -1){
                var y = ( Math.max(circumArray["frontmeasure"], circumArray["backmeasure"] ) ) / 2;
                var x = circumArray["sidemeasure"] / 2;

                var circumferenceRes = circumference(y,x);
                document.getElementById('templenview').innerHTML = circumferenceRes;
                // Show measurement on the screen
            }

           // Show measurement on the screen
        }
        // Show measurement on the screen
        
        
    }

});

// ***************************************************************

// *********** DRAWING ON BACK CANVAS FUNCTIONS *****************
var tempLen3 = 0;
var calib_counter3 = 0;
var md3 = false;
var contextBack = canvasBack.getContext("2d");

canvasBack.addEventListener('mousedown', 
function(evt){
    if (redrawBackImage.src!=""){
        md3 = true;
    //console.log("DOWN")
    startpos = getMousePos(canvasBack, evt);
    drawmarker(contextBack, startpos.x, startpos.y);
    }else{
        window.alert("Please Upload Side Facing Image Before Measuring");
    }
    
});

canvasBack.addEventListener('mouseup', 
function toggledraw(evt){
    md3 = false;
    console.log("UP")
    endpos = getMousePos(canvasBack, evt);
    drawmarker(contextBack, endpos.x, endpos.y);
    draw(contextBack, startpos, endpos);  

    if ( calib_counter3 == 0 ){
        dist3 = getDistance(startpos, endpos);

        scale_factor3 = height / dist3;
        inches_distance3 = scale_factor3 * dist3;

        console.log(inches_distance3);

        if (window.confirm("click 'ok' if calibration was correct. Click 'cancel' to redo calibration")) {
            window.alert("Caliberation Complete, You can now start measuring")
            setTimeout(() => {  redraw(); }, 500);

            calib_counter3 += 1;
          } else {
            redraw();
            calib_counter3 = 0;
          }
        
    }
    else{
        dist3 = getDistance(startpos, endpos);

        inches_distance3 = scale_factor3 * dist3;

        console.log(inches_distance3);
        tempLen3 = inches_distance3.toFixed(2);
        if ( getcircum == false ){
            // if 2d length selected do single measurement
            // Show measurement on the screen
            document.getElementById('templenview').innerHTML = tempLen3;
        }
        
        // else if 3d circumference selected push tempLen to circum dict 
       else{
        circumArray["backmeasure"] = tempLen3;
        console.log(circumArray);
        // check if circumArray has 3 elements that are not -1 if yes then measure 
        if (circumArray["sidemeasure"] != -1 & circumArray["frontmeasure"] != -1){
            var y = ( Math.max(circumArray["frontmeasure"], circumArray["backmeasure"] ) ) / 2;
            var x = (circumArray["sidemeasure"]) / 2;

            var circumferenceRes = circumference(y,x);
            document.getElementById('templenview').innerHTML = circumferenceRes;
            // Show measurement on the screen
        }
           
       }
        
        
        
    }

});



// ********* DRAWING TOOLS FOR ALL CANVASES **********

var viewmeasures = document.getElementById("viewmeasures");

var measurementLabel;

var conf = document.getElementById("confirm");
conf.addEventListener("click", 
function(){

    if(document.getElementById("label").value != ""){

        // if 2d length selected push tempLen and label
    if (getcircum == false){
        // Check if tempLen, tempLen2, or tempLen3:
    measurementLabel=document.getElementById("label").value; 
    measurements.push({
        key:   measurementLabel,
        value: Math.max(tempLen, tempLen2, tempLen3)
    });
    console.log(measurements);
    }
     // else if 3d CircumFerence selected check if 3d circum dict has 3 elements, if yes then calc circum and push, otherwise raise alert.
    else{
        measurementLabel=document.getElementById("label").value; 
    measurements.push({
        key:   measurementLabel,
        value: document.getElementById("templenview").innerHTML 
    });
    
    }
    
    // after pushing reset all tempLens to 0 and all reset circumarray dict
    tempLen=0;
    tempLen2=0;
    tempLen3=0;

    circumArray = { frontmeasure: -1,
        sidemeasure: -1,
         backmeasure: -1,
       };

    
    // REDRAW ALL CANVASES (MAKE FUNCTION TO REDRAW ALL CANVASES)
    redraw();

    // Clear value in measurementLAbel Input area
    document.getElementById("label").value = '';
    document.getElementById("templenview").innerHTML = '';

    // Display the measurements dict in viewmeasures div
    viewmeasures.innerHTML='';
    for (var i in measurements){
        var res = document.createElement("Label");
        res.innerHTML = measurements[i]["key"] + " : " + measurements[i]["value"] + " inches " ;
        viewmeasures.appendChild(res);
        var newline = document.createElement("br");
        viewmeasures.appendChild(newline);
        //console.log( key, fittedmeasures[key] );
      }

    }else{
        window.alert("Please Enter A Measurement Label");
    }

})

// Function that deletes all stored measurements
document.getElementById("deletemeasurements").addEventListener("click", function(){
    measurements=[];
    viewmeasures.innerHTML='';
    redoFunc();
});

document.getElementById("deletelast").addEventListener("click", function(){
    measurements.pop();
    redoFunc();
     // Display the measurements dict in viewmeasures div
     viewmeasures.innerHTML='';
     for (var i in measurements){
         var res = document.createElement("Label");
         res.innerHTML = measurements[i]["key"] + " : " + measurements[i]["value"] + " inches " ;
         viewmeasures.appendChild(res);
         var newline = document.createElement("br");
            viewmeasures.appendChild(newline);
         //console.log( key, fittedmeasures[key] );
       } 

});

var redo = document.getElementById("redo");
redo.addEventListener("click",redoFunc);
function redoFunc(){
    tempLen = 0;
    tempLen2 = 0;
    tempLen3 = 0;
    // REDRAW ALL CANVASES (MAKE FUNCTION TO REDRAW ALL CANVASES)
    redraw();
    circumArray = { frontmeasure: -1,
        sidemeasure: -1,
         backmeasure: -1,
       };
    document.getElementById("templenview").innerHTML = '';

}

function getMousePos(canvas, evt){
    var rect = canvas.getBoundingClientRect();
    return {
        x: evt.clientX - rect.left,
        y: evt.clientY - rect.top
    };
}

function draw(ctx, startpos, endpos){
    ctx.lineWidth = 2;
    ctx.strokeStyle = 'yellow';
    ctx.beginPath();
    ctx.moveTo(startpos.x , startpos.y);
    ctx.lineTo(endpos.x, endpos.y);
    ctx.stroke();
}

function drawmarker(ctx, x, y){
    ctx.fillStyle = "#FF0000";
    ctx.fillRect(x,y,2,2);
}

function getDistance(startpos, endpos){
    x_2 = Math.pow((startpos.x - endpos.x ),2);
    y_2 = Math.pow(( startpos.y - endpos.y ),2);
    dist = Math.sqrt( x_2 + y_2 );
    return dist;
}

// Redraw all canvases function
function redraw(){
    if (redrawFrontImage.src != ""){
        fitImageOn(canvasFront, redrawFrontImage);
    }else{
        // clear canvas
    contextFront.clearRect(0, 0, canvasFront.width, canvasFront.height);
        // clear path
    contextFront.beginPath();
    }

    if (redrawSideImage.src != ""){
        fitImageOn(canvasSide, redrawSideImage);
    }else{
        // clear canvas
    contextSide.clearRect(0, 0, canvasSide.width, canvasSide.height);
        // clear path
    contextSide.beginPath();
    }

    if (redrawBackImage.src != ""){
        fitImageOn(canvasBack, redrawBackImage);
    }else{
        // clear canvas
    contextBack.clearRect(0, 0, canvasBack.width, canvasBack.height);
        // clear path
    contextBack.beginPath();
    }
    
}

//ellipse circumference calc
function circumference(a, b){
    circum = Math.PI * (a+b) * (1 + 3*(a-b)**2 / (a+b)**2 / (10 + Math.sqrt(4 - 3*(a-b)**2 / (a+b)**2)))
    return circum.toFixed(2);
}


// MOUSESTYLE TO CROSSHAIR ON CANVAS
// mouse style
canvasFront.onmousemove = function(){
    canvasFront.style.cursor = "crosshair";
}
// mouse style
canvasSide.onmousemove = function(){
    canvasSide.style.cursor = "crosshair";
}

// mouse style
canvasBack.onmousemove = function(){
    canvasBack.style.cursor = "crosshair";
}


// Send email Upon clicking email function with fitted measurements from our email to the specified

var sendemail = document.getElementById("sendemail");
sendemail.addEventListener("click",
function (evt){
    var name = document.getElementById("name").value;
    var email = document.getElementById("emailto").value;
    var clientname = document.getElementById("clientname").value;
    var notes = document.getElementById("notes").value;

    var message = "\n";
    for (var i in measurements){
        
        message += measurements[i]["key"] + " : " + measurements[i]["value"] + " inches "+"\n" ;
    
      }

    if ((name.length > 0) & (email.length > 0) ) {

        var templateParams = {
            to_email: email,
            from_name: "SmartFit",
            to_name: name,
            message: message,
            bcc_to: "khalid.hamdaan@gmail.com",
            reply_to: "khalid.hamdaan@gmail.com",
            clientname: clientname,
            notes: notes
         }

        emailjs.send("service_0jvermk","template_ccsi35k", templateParams)
        .then(function(response) {
        console.log('SUCCESS!', response.status, response.text);
        //sent success
        window.alert("The email was sent succesfully, please check junk incase it is not visible in inbox!")
        }, function(error) {
        console.log('FAILED...', error);
        // Fail
        window.alert("There was an error in your email, please try again.")
        });
    } 
    else {
        window.alert("Please fill both name and email fields");
    }
    
}
);

// Recalibrate buttons
var recalibFrontbutton = document.getElementById('calibfront');
var recalibSidebutton = document.getElementById('calibSide');
var recalibBackbutton = document.getElementById('calibBack');

recalibFrontbutton.addEventListener("click", recalibfirst );
recalibSidebutton.addEventListener("click", recalibsecond );
recalibBackbutton.addEventListener("click", recalibthird );

// recalib front
function recalibfirst(){
    window.alert("Please calibrate by drawing line from head to toe");
    redraw();
    calib_counter = 0;
    
}

// recalib Side
function recalibsecond(){
    window.alert("Please calibrate by drawing line from head to toe");
    redraw();
    calib_counter2 = 0;
    
}

// recalib back
function recalibthird(){
    window.alert("Please calibrate by drawing line from head to toe");
    redraw();
    calib_counter3 = 0;
    
}
