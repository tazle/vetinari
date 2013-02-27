var app = {

    initialize: function() {
        var canvas = $("clock");
        var ctx = canvas.getContext('2d');
        ctx.fillStyle = "rgb(200, 0, 0)";
        ctx.fillRect(10, 10, 50, 50);
        $("afterDraw").show();
    }

};

function onLoad() {
    document.addEventListener("deviceready", onDeviceReady, false);
}
