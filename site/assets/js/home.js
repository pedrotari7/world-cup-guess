function get_home(user_id) {
    document.title = "Home";

    get_user_info(user_id);

    var banner = document.getElementById('banner');

    while (banner.firstChild) {
        banner.removeChild(banner.firstChild);
    }

    var sign_out = document.getElementById("sign_out");
    sign_out.innerText = 'SignOut';

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

    testConnection();

    var xhr = new XMLHttpRequest();

    xhr.open("GET", url, true);

    xhr.setRequestHeader('Content-type','application/json; charset=utf-8');

    xhr.onload = function () {
        var next_game = JSON.parse(xhr.responseText);
        if (xhr.readyState == 4 && xhr.status == "200") {
            user_name = document.getElementById('user_name');
            user_name.style.color = "#A6E22E";
            document.getElementById('user').style.color = "#A6E22E";
            profile_picture_img = document.getElementById('profile_picture_img');

            if (next_game['next_game'] != null) {

                var closureMaker = function(a, b, e) {
                    return function(){
                        user_name = document.getElementById('user');
                        user_name.style.color = "#A6E22E";
                        get_game(a, b, e);};
                }
                var closure = closureMaker(user_id, next_game['next_game'], 'next');
                user_name.addEventListener('click', closure, false);
                profile_picture_img.addEventListener('click', closure, false);

                get_game(user_id, next_game['next_game'], 'next');
            } else {
                get_leaderboard(user_id);
            }
        } else {
            console.error(result);
        }
    }
    xhr.send(null);
}

function get_user_info(user_id) {
    var url = "http://www.worldcupguess.win:5000/api/v1.0/users/info";

    testConnection();

    var xhr = new XMLHttpRequest();

    xhr.open("GET", url+'/'+user_id, true);

    xhr.setRequestHeader('Content-type','application/json; charset=utf-8');

    xhr.onload = function () {
        var result = JSON.parse(xhr.responseText);
        if (xhr.readyState == 4 && xhr.status == "200") {

            user_name = document.getElementById('user_name');
            user_name.innerHTML = '<span id="user">' + result["name"] + '</span>' + ' &#8962;';

            profile_picture_img = document.getElementById('profile_picture_img');
            profile_picture_img.src = result["picture"];

            var my_predictions = document.getElementById("my_predictions");
            my_predictions.innerText = 'My Predictions';

            var closureMaker = function(a, b) {
                return function(){get_my_predictions(a, b);};
            }
            var closure = closureMaker(user_id, result["name"]);
            my_predictions.addEventListener('click', closure, false);


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