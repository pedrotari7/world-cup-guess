function get_my_predictions(user_id) {
    var url = "http://www.worldcupguess.win:5000/api/v1.0/predictions";

    var xhr = new XMLHttpRequest();

    xhr.open("GET", url+'/'+user_id, true);

    xhr.setRequestHeader('Content-type','application/json; charset=utf-8');

    xhr.onload = function () {
        var info = JSON.parse(xhr.responseText);
        if (xhr.readyState == 4 && xhr.status == "200") {
            previous_stage = "";
            games = info['games'];
            teams = info['teams'];
        } else {
            console.error(games);
        }
    }
    xhr.send(null);
}