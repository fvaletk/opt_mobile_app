/**
 * Created by Ali Camargo on 30/08/15.
 */



function colorWheelPicker(colors, canvas_id, width_container, width_center, container_id, center_id, value_id) {

    this.canvas = document.getElementById(canvas_id);
    this.canvas.width = width_container;
    this.canvas.height = width_container;

    this.setStyle( container_id, center_id, width_container, width_center );

    this.colors = colors;
    this.data = this.setData();

    // this.img = document.getElementById('image-canvas');
    this.container = document.getElementById(container_id);
    this.center = document.getElementById(center_id);
    this.set_value = value_id ? document.getElementById(value_id) : null;




    this.radius = Math.floor( this.canvas.width / 2 );
    this.X = this.canvas.offsetLeft + this.radius;
    this.Y = this.canvas.offsetTop + this.radius;

    this.centerRadius = Math.floor( this.center.offsetWidth / 2 );

    this.hex = null;
    this.rgb = null;



    this.draw();
}

colorWheelPicker.prototype = {

    setData: function(){
        var value = 360 / this.colors.length;
        var data = [];
        for (var i = 0; i < this.colors.length; i++) {
            data[i] = value;
        };
        return data;
    },

    draw: function() {
        var self = this;
        var context = this.canvas.getContext("2d");

        for (var i = 0; i < this.data.length; i++) {
            this.drawSegment(context, i, this.data[i]);
        }
        // this.convertCanvasToImage();
        this.startMouseMove();
        this.startupTouch();
    },

    drawSegment: function(context, i, size) {
        var self = this;
        context.save();

        var startingAngle = self.degreesToRadians(self.sumTo(self.data, i));

        var arcSize = self.degreesToRadians(size);

        var endingAngle = startingAngle + arcSize;

        context.beginPath();
        context.moveTo(self.X, self.Y);

        context.arc(self.X, self.Y, self.radius, startingAngle, endingAngle, false);
        context.closePath();

        context.fillStyle = self.colors[i];

        context.fill();

        context.restore();
    },

    convertCanvasToImage: function() {

        this.img.src = this.canvas.toDataURL("image/png");
        this.canvas.remove();
        // return image;
    },


    // helper functions
    degreesToRadians: function(degrees) {
        return (degrees * Math.PI)/180;
    },

    sumTo: function(a, i) {
        var sum = 0;
        for (var j = 0; j < i; j++) {
            sum += a[j];
        }
        return sum;
    },

    findPos: function() {
        var curleft = 0, curtop = 0, obj = this.container;
        if (this.container.offsetParent) {
            do {
                curleft += obj.offsetLeft;
                curtop += obj.offsetTop;
            } while (obj = obj.offsetParent);
            return { x: curleft, y: curtop };
        }
        return undefined;
    },

    rgbToHex: function(r, g, b) {
        if (r > 255 || g > 255 || b > 255)
            throw "Invalid color component";
        return ((r << 16) | (g << 8) | b).toString(16).toUpperCase();
    },

    startMouseMove: function(){
        self = this;
        this.canvas.onmousemove = function(e) {
            self.setColor(  e.pageX, e.pageY );
        }
    },

    setColor: function( pageX, pageY ){

        var self = this;
        var pos = self.findPos();
        var x = pageX - pos.x;
        var y = pageY - pos.y;

        var d = Math.floor( Math.sqrt( Math.pow( ( self.X - x ), 2 ) + Math.pow( ( self.Y - y ), 2 ) ) );


        var coord = "x=" + x + ", y=" + y + ", d=" + d;

        // -- if d > ( this.centerRadius - 1 )  -> cursor out center circle
        // -- if d < ( this.radius - 1 )  -> cursor in container circle
        if( !( d > ( this.centerRadius - 1 ) && d < ( self.radius - 1 ) ) ){
            return false;
        }

        var context = self.canvas.getContext("2d");
        var p = context.getImageData(x, y, 1, 1).data;

        self.rgb = [p[0], p[1], p[2]]
        self.hex = "#" + ("000000" + self.rgbToHex(p[0], p[1], p[2])).slice(-6);

        // console.logconsole.log( coord + "<br>" + self.hex );


        if(this.set_value){
            this.set_value.value = self.hex;
        }

        self.center.style.backgroundColor = self.hex;
    },

    startupTouch: function() {
        this.canvas.addEventListener("touchstart", this.handleStart, false);
        this.canvas.addEventListener("touchend", this.handleEnd, false);
        this.canvas.addEventListener("touchcancel", this.handleCancel, false);
        this.canvas.addEventListener("touchleave", this.handleEnd, false);
        this.canvas.addEventListener("touchmove", this.handleMove, false);
    },

    handleStart: function(e) {
        e.preventDefault();
        var touches = e.changedTouches;

        self.setColor(touches[0].clientX, touches[0].clientY);

    },

    handleEnd: function(e) {
        e.preventDefault();
        var touches = e.changedTouches;

        self.setColor(touches[0].clientX, touches[0].clientY);
    },

    handleCancel: function(e) {
        e.preventDefault();
        var touches = e.changedTouches;

        self.setColor(touches[0].clientX, touches[0].clientY);
    },

    handleEnd: function(e) {
        e.preventDefault();
        var touches = e.changedTouches;

        self.setColor(touches[0].clientX, touches[0].clientY);
    },

    handleMove: function(e) {
        e.preventDefault();
        var touches = e.changedTouches;

        self.setColor(touches[0].clientX, touches[0].clientY);
    },

    getColorHEX: function(){
        return this.hex;
    },

    getColorRGB: function(){
        return this.rgb;
    },

    setStyle: function( container_id, center_id, width_container, width_center ){
        var css =  '#' + container_id + '{';
        css += '      width: ' + width_container + 'px;';
        css += '      height: ' + width_container + 'px;';
        css += '      position: relative;';
        css += '      -webkit-border-radius: 50%;';
        css += '      -moz-border-radius: 50%;';
        css += '      border-radius: 50%;';
        css += '      z-index: 1;';
        css += '      overflow: hidden;';
        css += '      cursor: crosshair;';
        css += '      margin: 0 auto;';
        css += '} ';
        css += '#' + container_id + ' img{';
        css += '      position: absolute;';
        css += '      top: 0;';
        css += '      left: 0;';
        css += '      z-index:0;';
        css += '      -webkit-border-radius: 50%;';
        css += '      -moz-border-radius: 50%;';
        css += '      border-radius: 50%;';
        css += '} ';
        css += '#' + container_id + ' #' + center_id + '{';
        css += '    width: ' + width_center + 'px;';
        css += '    height: ' + width_center + 'px;';
        css += '    position: absolute;';
        css += '    z-index: 11;';
        css += '    background-color: white;';
        css += '    top: 0;';
        css += '    left: 0;';
        css += '    -webkit-border-radius: 50%;';
        css += '    -moz-border-radius: 50%;';
        css += '    border: 10px solid white;';
        css += '    border-radius: 50%;';
        css += '    margin-top: ' + (width_container/2 - width_center/2 - 10) + 'px;';
        css += '    margin-left: ' + (width_container/2 - width_center/2 - 10) + 'px;';

        css += '} ';

        var head = document.head || document.getElementsByTagName('head')[0],
            style = document.createElement('style');

        style.type = 'text/css';

        if ( style.styleSheet ){
            style.styleSheet.cssText = css;
        } else {
            style.appendChild(document.createTextNode(css));
        }

        head.appendChild(style);
    }


}


