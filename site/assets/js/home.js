function get_home(user_id) {
    document.title = "Home";

    get_user_info(user_id);

    var banner = document.getElementById('banner');

    while (banner.firstChild) {
        banner.removeChild(banner.firstChild);
    }

    var sign_out = document.getElementById("sign_out");
    sign_out.innerText = 'SignOut';

    var my_predictions = document.getElementById("my_predictions");
    my_predictions.innerText = 'My Predictions';

    var closureMaker = function(a) {
        return function(){get_my_predictions(a);};
    }
    var closure = closureMaker(user_id);
    my_predictions.addEventListener('click', closure, false);

    var leaderboard = document.getElementById("leaderboard");

    leaderboard.innerText = 'Leaderboard';

    var closureMaker = function(a) {
        return function(){get_leaderboard(a);};
    }
    var closure = closureMaker(user_id);
    leaderboard.addEventListener('click', closure, false);

    var schedule = document.getElementById("schedule");

    schedule.innerText = 'Schedule';

    var closureMaker = function(a) {
        return function(){get_schedule(a);};
    }
    var closure = closureMaker(user_id);
    schedule.addEventListener('click', closure, false);

    // schedule_td.appendChild(schedule);
    // header_row.appendChild(schedule_td);

    // var rules_td = document.createElement('td');
    // rules_td.className = 'header_td';
    // rules_td.id = 'rules';

    // var rules = document.createElement("a");
    // rules.setAttribute("id", "rules_link");
    // var rules_icon = document.createElement("img");
    // rules_icon.className = 'menu_icon'
    // rules_icon.src = 'resources/images/rules.png';
    // rules.appendChild(rules_icon);
    // var closureMaker = function(a) {
    //     return function(){get_rules(a);};
    // }
    // var closure = closureMaker(user_id);
    // rules.addEventListener('click', closure, false);

    // rules_td.appendChild(rules);
    // header_row.appendChild(rules_td);

}

function get_user_info(user_id) {
    var url = "http://www.worldcupguess.win:5000/api/v1.0/users/info";

    var xhr = new XMLHttpRequest();

    xhr.open("GET", url+'/'+user_id, true);

    xhr.setRequestHeader('Content-type','application/json; charset=utf-8');

    xhr.onload = function () {
        console.log(xhr.responseText);
        var result = JSON.parse(xhr.responseText);
        if (xhr.readyState == 4 && xhr.status == "200") {
            document.getElementById('user_name').innerHTML = result["name"];
            document.getElementById('profile_picture_img').src = result["picture"];
        } else {
            console.error(result);
        }
    }
    xhr.send(null);
}