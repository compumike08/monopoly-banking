var stompClient = null;

function setConnected(connected) {
    $("#connect").prop("disabled", connected);
    $("#disconnect").prop("disabled", !connected);
    if (connected) {
        $("#conversation").show();
    }
    else {
        $("#conversation").hide();
    }
    $("#greetings").html("");
}

function connect() {
    var socket = new SockJS('/gs-guide-websocket');
    stompClient = Stomp.over(socket);
    stompClient.connect({}, function (frame) {
        setConnected(true);
        console.log('Connected: ' + frame);
        stompClient.subscribe('/topic/games', function (payment) {
            showGreeting(JSON.parse(payment.body));
        });
    });
}

function disconnect() {
    if (stompClient !== null) {
        stompClient.disconnect();
    }
    setConnected(false);
    console.log("Disconnected");
}

function sendName() {
    stompClient.send("/app/paysocket", {}, JSON.stringify({
        gameId: 1,
        payRequestUUID: "eaeb5b18-aa8f-4910-9044-2f35fa324848",
        fromId: 4,
        toId: 5,
        requestInitiatorUserId: 4,
        isFromSink: false,
        isToSink: false,
        amountToPay: 200,
        originalFromAmount: 1500,
        originalToAmount: 1500
    }));
}

function showGreeting(message) {
    console.log(message);
}

$(function () {
    $("form").on('submit', function (e) {
        e.preventDefault();
    });
    $( "#connect" ).click(function() { connect(); });
    $( "#disconnect" ).click(function() { disconnect(); });
    $( "#send" ).click(function() { sendName(); });
});
