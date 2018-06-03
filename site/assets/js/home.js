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

    get_next_game(user_id);

}

function get_next_game(user_id) {
    var url = "http://www.worldcupguess.win:5000/api/v1.0/game/next";

    var xhr = new XMLHttpRequest();

    xhr.open("GET", url, true);

    xhr.setRequestHeader('Content-type','application/json; charset=utf-8');

    xhr.onload = function () {
        var next_game = JSON.parse(xhr.responseText);
        if (xhr.readyState == 4 && xhr.status == "200") {
            console.log(next_game);
            get_game(user_id, next_game['next_game'])
        } else {
            console.error(result);
        }
    }
    xhr.send(null);
}

function get_user_info(user_id) {
    var url = "http://www.worldcupguess.win:5000/api/v1.0/users/info";

    var xhr = new XMLHttpRequest();

    xhr.open("GET", url+'/'+user_id, true);

    xhr.setRequestHeader('Content-type','application/json; charset=utf-8');

    xhr.onload = function () {
        var result = JSON.parse(xhr.responseText);
        if (xhr.readyState == 4 && xhr.status == "200") {
            document.getElementById('user_name').innerHTML = result["name"];
            document.getElementById('profile_picture_img').src = result["picture"];
            if (result['admin']) {
                container = document.getElementById('container');
                admin_link = document.createElement('a');
                admin_link.className = 'footer_img_container';
                admin_img = document.createElement('img');
                admin_img.className = 'footer_img';
                admin_img.src = 'resources/images/admin.png';

                var closureMaker = function(a) {
                    return function(){get_admin(a);};
                }
                var closure = closureMaker(user_id);
                admin_link.addEventListener('click', closure, false);

                admin_link.appendChild(admin_img);
                container.appendChild(admin_link);

            }
        } else {
            console.error(result);
        }
    }
    xhr.send(null);
}