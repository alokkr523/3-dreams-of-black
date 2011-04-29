var WonderWall = WonderWall || {};
WonderWall.Point = function(gee, x, y) {

  // Private variables
  var that = this;
  var g = gee.ctx;
  var ox = x;
  var oy = y;
  var angle = 0;

  // Public variables
  this.x = x;
  this.y = y;
  this.threshold = 0.1;
  this.easing = 0.125;
  this.maxDist = gee.height / 4.0;
  this.updating = false;
  this.angle = 0;

  this.update = function() {

    if(this.updating) {
      
      var dx = gee.mouseX - ox;
      var dy = gee.mouseY - oy;
      var d = Math.sqrt(dx * dx + dy * dy);

      if(d <= this.maxDist) {

        angle = Math.atan2(dy, dx);
        if((gee.mouseX > gee.width / 2.0 && gee.mouseY < gee.height / 2.0) ||
            gee.mouseX < gee.width / 2.0 && gee.mouseX > gee.height / 2.0) {
            angle = angle - Math.PI;
        }

        var s = Math.sin(angle);
        var c = Math.cos(angle);

        // the nasty...canvas has to be a set size now, based on whatever params are held
        // in the wonderWall.html
        if(gee.mouseX < gee.width / 2.0 && gee.mouseY < gee.height / 2.0) {
          s = Math.cos(angle - Math.PI);
          c = -Math.cos(angle) + Math.PI / 4.0;
        } else if(gee.mouseX > gee.width / 2.0 && gee.mouseY < gee.height / 2.0) {
          s = Math.cos(angle - Math.PI);
          c = Math.cos(angle) + Math.PI / 4.0;
        }
        if(gee.mouseY < gee.height * .3 && gee.mouseX < gee.width / 2.0) {
          c = -Math.cos(angle);
        } else if(gee.mouseY < gee.height * .3 && gee.mouseX > gee.width / 2.0) {
          c = Math.cos(angle);
        }
        r = this.maxDist * .25;

        x = ox + (s * r);
        y = oy + (c * r);

        this.easing = .35;
      } else {

        x = ox;
        y = oy;
        angle = 0;

        this.easing = 0.125;
      }
    } else {

      x = ox;
      y = oy;
      angle = 0;

      this.easing = 0.125;
    }

    this.x = this.ease(this.x, x, this.easing);
    this.y = this.ease(this.y, y, this.easing);
    this.angle = this.ease(this.angle, angle, this.easing);
  };
};
WonderWall.Point.prototype.ease = function(cur, tar, inc) {
  var dif = tar - cur;
  if(Math.abs(dif) < (inc / 100.0)) cur = tar;
  else cur += dif * inc;
  return cur;
};

WonderWall.Pentagon = function(gee, x, y, r) {

  var that = this;
  var g = gee.ctx;

  this.separate = false;
  this.showFill = true;
  this.showStroke = true;
  this.insides = false;

  this.x = x;
  this.y = y;
  if(this.x == undefined || this.x == null || this.x == NaN) {
    this.x = gee.width / 2.0;
  }
  if(this.y == undefined || this.y == null || this.y == NaN) {
    this.y = gee.height / 2.0;
  }

  var coords = this.generatePoints(this.x, this.y, r, 5);
  var points = [];

  for(var i = 0; i < coords.length; i++) {
    var coord = coords[i];
    points.push(new WonderWall.Point(gee, coord.x, coord.y));
  }

  this.update = function() {

    if(!this.separate) this.separate = true;
    for(var i = 0; i < points.length; i++) {
      points[i].update();
    }
    return this;
  };

  this.render = function() {

    if(this.insides && this.showStroke) {
      for(var i = 0; i < points.length; i++) {
        var point = points[i];
        if(!this.separate) {
          point.update();
        }
        g.beginPath();
        g.moveTo(this.x, this.y);
        g.lineTo(point.x, point.y);
        g.stroke();
      }
    }

    g.beginPath();
    for(var i = 0; i < points.length; i++) {
      var point = points[i];
      if(!this.separate) {
        point.update();
      }
      if(i < 1) {
        g.moveTo(point.x, point.y);
      } else {
        g.lineTo(point.x, point.y);
      }
    }
    g.closePath();
    if(this.showFill) g.fill();
    if(this.showStroke) g.stroke();
  };

  this.setUpdate = function(b) {
    for(var i = 0; i < points.length; i++) {
      var point = points[i];
      point.updating = b;
    }
  };

};
WonderWall.Pentagon.prototype.generatePoints = function(x, y, a, l) {
  var points = [];
  for(var i = 0; i < l; i++) {
    var xpos = a * Math.sin(i / l * 2.0 * Math.PI) + x;
    var ypos = -a * Math.cos(i / l * 2.0 * Math.PI) + y;
    points.push({x: xpos, y: ypos});
  }
  return points;
};