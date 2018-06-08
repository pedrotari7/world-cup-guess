
function startTimer(duration, display) {
    var timer = duration, hours, minutes, seconds;
    setInterval(function () {

    	hours = parseInt(timer / 3600, 10);

        minutes = parseInt(timer / 60 - hours*60, 10);
        seconds = parseInt(timer % 60, 10);

        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;

        display.innerText = hours + ":" + minutes + ":" + seconds;

        if (--timer < 0) {
            location.reload();
        }
    }, 1000);
}

function convertDateToUTC(date) {
    return new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds());
}