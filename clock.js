var rndtime = {
    logistic: function(x) {
        return 1/(1+Math.exp(-x));
    },

    dist: function(x) {
        l = this.logistic((x-.5)*8);
        return 2*l;
    },

    clamp: function(x, min, max) {
        if (x < min) {
            return min;
        } else if (x > max) {
            return max;
        } else {
            return x;
        }
    },

    makeSeq: function(t) {
        var seed = t.toISOString().substring(0, 17);
        Math.seedrandom(seed);

        var nums = [];
        var sum = 0;
        for (var i = 0; i < 60; i++) {
            var num = this.clamp(this.dist(Math.random()), 0.4, 4);
            sum += num;
            nums.push(num);
        }
        
        var scale = 60/sum;

        var cumnums = [0];
        sum = 0;
        for (var i = 0; i < 60; i++) {
            var cnum = nums[i] * scale;
            sum += cnum;
            cumnums.push(sum);
        }

        return cumnums;
    },
    
    secondsFor: function(t) {
        var cumnums = this.makeSeq(t);

        for (var i = 0; i < 60; i++) {
            if (cumnums[i] > (t.getSeconds() + t.getMilliseconds()/1000.0)) {
                return i-1;
            }
        }
    },

    sleepLengthAt: function(t) {
        var cumnums = this.makeSeq(t);
        var nextWakeUpAt = 60;
        for (var i = 0; i < 60; i++) {
            if (cumnums[i] > (t.getSeconds() + t.getMilliseconds()/1000.0)) {
                nextWakeUpAt = cumnums[i];
                break;
            }
        }
        var sleepLength = nextWakeUpAt - t.getSeconds() - t.getMilliseconds()/1000.0;
        return sleepLength*1000;
    }
}

var app = {
    initialize: function() {
        var canvas = document.getElementById("clock");
        var w = $(window).width();
        var h = $(window).height();
        
        canvas.height = h;
        canvas.width = w;
        
        var t = new Date();
        this.draw(t);
        window.setTimeout(app.update, 100);
    },

    update: function(time) {
        var t = new Date();
        app.draw(t);
        var sleepLength = rndtime.sleepLengthAt(t);
        console.log(sleepLength);
        window.setTimeout(app.update, sleepLength);
    },

    draw: function(time) {
        var canvas = document.getElementById("clock");
        var w = $(window).width();
        var h = $(window).height();

        minDim = h < w ? h : w;
        r = (minDim/2)*0.98;

        var mx = w/2;
        var my = h/2;

        var ctx = canvas.getContext("2d");

        this.outerEdge(ctx, mx, my, r);

        for (var i = 0; i < 1; i+= 1/60.0) {
            this.smallTick(ctx, mx, my, r, 2*Math.PI*i);
        }

        for (var i = 0; i < 1; i+= 1/12.0) {
            this.largeTick(ctx, mx, my, r, 2*Math.PI*i);
        }

        this.showTime(ctx, mx, my, r, time);

        this.center(ctx, mx, my, r);
    },

    showTime: function(ctx, mx, my, r, time) {
        this.hourPointer(ctx, mx, my, r, 2*Math.PI*(time.getHours()/12+time.getMinutes()/60/12));
        this.minutePointer(ctx, mx, my, r, 2*Math.PI*(time.getMinutes()/60));
        var seconds = rndtime.secondsFor(time);
        this.secondPointer(ctx, mx, my, r, 2*Math.PI*(seconds/60));
    },

    atMidAndAngle: function(ctx, mx, my, r, angle, shape) {
        ctx.save();
        ctx.translate(mx, my);
        ctx.rotate(angle);

        shape();

        ctx.restore();
    },

    center: function(ctx, mx, my, r) {
        this.atMidAndAngle(ctx, mx, my, r, 0, function() {
            ctx.beginPath();
            ctx.arc(0, 0, r*0.03, 0, 2*Math.PI, false);
            ctx.closePath();

            ctx.fillStyle = "rgb(255, 0, 0)";
            ctx.fill();
        });
    },

    smallTick: function(ctx, mx, my, r, angle) {
        this.atMidAndAngle(ctx, mx, my, r, angle, function() {
            ctx.beginPath();
            ctx.moveTo(-2, -r*0.97);
            ctx.lineTo(2, -r*0.97);
            ctx.lineTo(2, -r*0.90);
            ctx.lineTo(-2, -r*0.90);
            ctx.closePath();
            
            ctx.fillStyle = "rgb(0, 0, 0)";
            ctx.fill();
        });
    },

    largeTick: function(ctx, mx, my, r, angle) {
        this.atMidAndAngle(ctx, mx, my, r, angle, function() {

            ctx.beginPath();
            ctx.moveTo(-3, -r*0.97);
            ctx.lineTo(3, -r*0.97);
            ctx.lineTo(3, -r*0.87);
            ctx.lineTo(-3, -r*0.87);
            ctx.closePath();

            ctx.fillStyle = "rgb(0, 0, 0)";
            ctx.fill();
        });
    },

    hourPointer: function(ctx, mx, my, r, angle) {
        this.atMidAndAngle(ctx, mx, my, r, angle, function() {

            ctx.beginPath();
            ctx.moveTo(-5, r*0.05);
            ctx.lineTo(5, r*0.05);
            ctx.lineTo(4, -r*0.6);
            ctx.lineTo(-4, -r*0.6);
            ctx.closePath();
            ctx.fillStyle = "rgb(0, 0, 0)";
            ctx.fill();

        });
    },

    minutePointer: function(ctx, mx, my, r, angle) {
        this.atMidAndAngle(ctx, mx, my, r, angle, function() {

            ctx.beginPath();
            ctx.moveTo(-3, r*0.05);
            ctx.lineTo(3, r*0.05);
            ctx.lineTo(2, -r*0.8);
            ctx.lineTo(-2, -r*0.8);
            ctx.closePath();
            ctx.fillStyle = "rgb(0, 0, 0)";
            ctx.fill();

            ctx.fillStyle = "rgb(0, 0, 0)";
            ctx.fill();
        });
    },

    secondPointer: function(ctx, mx, my, r, angle) {
        this.atMidAndAngle(ctx, mx, my, r, angle, function() {


            ctx.beginPath();
            ctx.moveTo(-2, r*0.05);
            ctx.lineTo(2, r*0.05);
            ctx.lineTo(1, -r*0.85);
            ctx.lineTo(-1, -r*0.85);
            ctx.closePath();
            ctx.fillStyle = "rgb(0, 0, 0)";
            ctx.fill();

            ctx.fillStyle = "rgb(0, 0, 0)";
            ctx.fill();
        });
    },

    outerEdge: function(ctx, mx, my, r) {
        ctx.beginPath();
        ctx.arc(mx, my, r, 0, 2*Math.PI, false);
        ctx.closePath();
        ctx.fillStyle = "rgb(0, 0, 0)";
        ctx.fill();

        ctx.beginPath();
        ctx.arc(mx, my, r*0.95, 0, 2*Math.PI, false);
        ctx.closePath();
        ctx.fillStyle = "rgb(255, 255, 255)";
        ctx.fill();

    }

};

if (window.PhoneGap) {
    document.addEventListener("deviceready", function() {app.initialize();}, false);
} else {
    $(document).ready(function() {
        app.initialize();
    })
}

