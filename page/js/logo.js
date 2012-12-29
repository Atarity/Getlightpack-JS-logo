function calcDistance(x1,y1,x2,y2) {
    var dx = x2 - x1;
    var dy = y2 - y1;
    return Math.sqrt(dx * dx + dy * dy);
}

function calcLenght(dx,dy) {
    var dx = x2 - x1;
    var dy = y2 - y1;
    return Math.sqrt(dx * dx + dy * dy);
}

function Vector(x,y) {
    this.x = x;
    this.y = y;
    this.len = function() {
        var x = this.x;
        var y = this.y;
        return Math.sqrt(x*x+y*y);
    };
    
    this.cosA = function(v) {
        var sMul = this.x * v.x + this.y * v.y;
        return sMul / (this.len() * v.len());
    };
}

function Rectangle(x1,y1,x2,y2) {
    this.x1 = x1;
    this.y1 = y1;
    this.x2 = x2;
    this.y2 = y2;

    this.getDistance = function(x, y) {
        if ( x < this.x1 ) {
            if ( y < this.y1) {
                return calcDistance(x, y, this.x1, this.y1);
            } else if ( y < this.y2) {
                return this.x1 - x;
            } else {
                return calcDistance(x, y, this.x1, this.y2);
            }
        } else if ( x < this.x2) {
            if ( y < this.y1) {
                return this.y1-y;
            } else if ( y < this.y2) {
                return 0;
            } else {
                return y - this.y2;
            }
        } else {
            if ( y < this.y1) {
                return calcDistance(x, y, this.x2, this.y1);
            } else if ( y < this.y2) {
                return x - this.x2;
            } else {
                return calcDistance(x, y, this.x2, this.y2);
            }
        }
    } 
}

var c;
var scaledCanvas;
var ctx, scaledCtx;
var imgData;

var gTime = 0;

var gWidth=64;
var gHeight=64;
var scaleFactor=200/64;
var gHalfWidth=Math.round(gWidth/2);
var gHalfHeight=Math.round(gHeight/2);
var mouseCoords=new Vector(-100,-100);

var backRect = new Rectangle(20, 20 , 44, 44);

function P(sA, isAddPi) {
    var i = gTime;
    var p =(Math.acos(sA)*6);
    if (isAddPi)
        return Math.cos( i * 0.2 - p );
    else
        return Math.cos(p + i * 0.2);
}

function animation() {
    var iData = imgData.data;
    var height = gHeight;
    var width = gWidth;
    var halfWidth = gHalfWidth;
    var halfHeight = gHalfHeight;
    var i = gTime;
    for (var y = 0; y < height; y++) {
        for (var x = 0; x < width; x++) {
            vi = new Vector( x-halfWidth, y-halfHeight);
            v0 = new Vector( halfWidth, 0);
            p = (y * width + x) * 4;
            mp = new Vector( mouseCoords.x - x, mouseCoords.y - y);
            md = mp.len() > 50 ? 0 : 50 - mp.len();
            s = backRect.getDistance(x,y)*12.9 + P(v0.cosA(vi), y > halfHeight) * 10 + md*2;
            iData[p + 0] = (Math.cos(0.017 * (y + i)) + 1) * 127;
            iData[p + 1] = (Math.sin(0.02 * (i - y + x)) + 1) * 127;
            iData[p + 2] = (Math.cos(0.045 * (y + i)) + 1) * 127;
            iData[p + 3] = s < 255 ? 255 - s : 0;
        }
    }
    
    ctx.putImageData(imgData, 0, 0);
    scaledCtx.clearRect(0,0,200,200);
    scaledCtx.drawImage(c, 0, 0);
}

function onMouseMove(e) {
    mouseCoords.x = (e.pageX - c.parentNode.offsetLeft)/scaleFactor;
    mouseCoords.y = (e.pageY - c.parentNode.offsetTop)/scaleFactor;
}

function initLogo() {
    c = document.getElementById("logo__invisible");
    scaledCanvas = document.getElementById("logo__back");
    ctx = c.getContext("2d");
    scaledCtx = scaledCanvas.getContext("2d");
    scaledCtx.scale(scaleFactor, scaleFactor);
    imgData = ctx.createImageData(gWidth,gHeight);
    document.addEventListener('mousemove', onMouseMove, 0);

}
