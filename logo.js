function Vector(x,y) {
    this.x = x;
    this.y = y;
    this.len = function() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
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
                return new Vector(x - this.x1, y - this.y1).len();
            } else if ( y < this.y2) {
                return this.x1 - x;
            } else {
                return new Vector(x - this.x1, y - this.y2).len();
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
                return new Vector(x - this.x2, y - this.y1).len();
            } else if ( y < this.y2) {
                return x - this.x2;
            } else {
                return new Vector(x - this.x2, y - this.y2).len();
            }
        }
    } 
}

var c;
var ctx;
var imgData;

var i = 0;

var width=100;
var height=100;
var halfWidth=Math.round(width/2);
var halfHeight=Math.round(height/2);
var mouseCoords=new Vector(0,0);

var backRect = new Rectangle(25, 25 , 75, 75);

function P(sA, isAddPi) {
    var p =(Math.acos(sA)*6);
    if (isAddPi)
        return Math.cos( i * 0.2 - p );
    else
        return Math.cos(p + i * 0.2);
}

function animation() {
    for (var y = 0; y < height; y++) {
        for (var x = 0; x < width; x++) {
            vi = new Vector( x-halfWidth, y-halfHeight);
            v0 = new Vector( halfWidth, 0);
            p = (y * width + x) * 4;
            mp = new Vector( mouseCoords.x - x, mouseCoords.y - y);
            md = mp.len() > 50 ? 0 : 50 - mp.len();
            s = backRect.getDistance(x,y)*10.9 + P(v0.cosA(vi), y > halfHeight) * 10 + md*2;
            imgData.data[p + 0] = (Math.cos(0.017 * (y + i)) + 1) * 127;
            imgData.data[p + 1] = (Math.sin(0.02 * (i - y + x)) + Math.sin(0.005 * (mp.len())) + 2) * 64;
            imgData.data[p + 2] = (Math.cos(0.045 * (y + i)) + 1) * 127;
            imgData.data[p + 3] = s < 255 ? 255 - s : 0;
        }
    }
    
    ctx.putImageData(imgData, 0, 0);

//    ctx.drawImage(imgData, 0, 0);
}

function initLogo() {
    c = document.getElementById("box1");
    ctx = c.getContext("2d");
//    ctx.scale(2,2);
    imgData = ctx.createImageData(width,height);
    document.addEventListener('mousemove', function (e) {
        mouseCoords.x = e.pageX - c.offsetLeft;
        mouseCoords.y = e.pageY - c.offsetTop;

    }, 0);

}
