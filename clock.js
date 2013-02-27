var app = {

    initialize: function() {
        var canvas = document.getElementById("clock");
        var ctx = canvas.getContext("2d");
        ctx.fillStyle = "rgb(200, 0, 0)";
        ctx.fillRect(10, 10, 50, 50);
        $("afterDraw").show();
    }

};

if (window.PhoneGap) {
    document.addEventListener("deviceready", function() {app.initialize();}, false);
} else {
    $(document).ready(function() {
        app.initialize();
    })
}

