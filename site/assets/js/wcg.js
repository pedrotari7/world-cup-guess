/****************************************************************
 *                          Google Login                        *
 * *************************************************************/

function onSuccess(googleUser) {
    console.log('Logged in as: ' + googleUser.getBasicProfile().getName());
      // The ID token you need to pass to your backend:
    var id_token = googleUser.getAuthResponse().id_token;
    console.log("ID Token: " + id_token);
    var url = "http://www.worldcupguess.win:5000/api/v1.0/login/google";
    var data = {};
    data.token = id_token;
    var json = JSON.stringify(data);

    var xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader('Content-type','application/json; charset=utf-8');
    xhr.onreadystatechange = function () {
        console.log(xhr.responseText);
        var result = JSON.parse(xhr.responseText);
        if (xhr.readyState == 4 && xhr.status == "201") {
            window.location.replace(result.next_page);
            console.log(result);
        } else {
            console.error(result);
        }
    }
    xhr.send(json);
}

function onFailure(error) {
  console.log(error);
}

function renderButton() {
    gapi.signin2.render('my-signin2',
        {
            'scope': 'profile email',
            'width': 300,
            'height': 50,
            'longtitle': false,
            'theme': 'dark',
            'onsuccess': onSuccess,
            'onfailure': onFailure
        }
    );
}

function signOut() {
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
      console.log('User signed out.');
    });
}

/****************************************************************
 *                        Facebook Login                        *
 * *************************************************************/

window.fbAsyncInit = function() {
    FB.init(
        {
            appId      : '189934098398018',
            cookie     : true,
            xfbml      : true,
            version    : 'v2.12'
        }
    );

    FB.AppEvents.logPageView();
};

(function(d, s, id){
var js, fjs = d.getElementsByTagName(s)[0];
if (d.getElementById(id)) {return;}
js = d.createElement(s); js.id = id;
js.src = "https://connect.facebook.net/en_US/sdk.js";
fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));

function checkLoginState() {
    FB.getLoginStatus(function(response) {
        statusChangeCallback(response);
    });
}

/****************************************************************
 *                        Load Fuctions                         *
 * *************************************************************/

window.onload = function() {
    user_id = get_id();
    get_user_info(user_id);
    document.getElementById("predictions").href += '?&id=' + user_id;
    document.getElementById("leaderboard").href += '?&id=' + user_id;
    document.getElementById("schedule").href += '?&id=' + user_id;

    if (document.title == "Schedule") {
        get_schedule(user_id);
    } else if (document.title == "My Predictions") {
        get_my_predictions(user_id);
    } else if (document.title == "Leaderboard") {
        get_leaderboard();
    } else if (document.title.includes("Game")) {
        var url = new URL(window.location.href);
        var game_num = url.searchParams.get("n");
        document.getElementById('game_title').innerHTML = "Game " + game_num;
        document.title = "Game " + game_num;
        get_game(user_id, game_num);
    }
}

function get_id() {
    var url = new URL(window.location.href);
    return url.searchParams.get("id");
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
            document.getElementById('profile_picture').src = result["picture"];
        } else {
            console.error(result);
        }
    }
    xhr.send(null);
}

function get_schedule(user_id) {
    var url = "http://www.worldcupguess.win:5000/api/v1.0/schedule";

    var xhr = new XMLHttpRequest();

    xhr.open("GET", url, true);

    xhr.setRequestHeader('Content-type','application/json; charset=utf-8');

    xhr.onload = function () {
        var info = JSON.parse(xhr.responseText);
        if (xhr.readyState == 4 && xhr.status == "200") {
            previous_stage = "";
            games = info['games'];
            teams = info['teams'];
            for (var g in games) {
                if (games[g]['stage'] != previous_stage) {
                    var stage_div = document.createElement('div');
                    stage_div.className = 'stage_div textBox';
                    stage_div.innerText = games[g]['stage'];
                    document.getElementById('banner').appendChild(stage_div);
                    previous_stage = games[g]['stage']

                    if (games[g]['stage'] == 'Groups Stage') {
                        var groups_div = document.createElement('div');
                        groups_div.className = 'groups';

                        var group = document.createElement('div');
                        group.className = 'textBox group group_A';
                        group.innerText = 'A';
                        groups_div.appendChild(group);

                        var group = document.createElement('div');
                        group.className = 'textBox group group_B';
                        group.innerText = 'B';
                        groups_div.appendChild(group);

                        var group = document.createElement('div');
                        group.className = 'textBox group group_C';
                        group.innerText = 'C';
                        groups_div.appendChild(group);

                        var group = document.createElement('div');
                        group.className = 'textBox group group_D';
                        group.innerText = 'E';
                        groups_div.appendChild(group);

                        var group = document.createElement('div');
                        group.className = 'textBox group group_F';
                        group.innerText = 'F';
                        groups_div.appendChild(group);

                        var group = document.createElement('div');
                        group.className = 'textBox group group_G';
                        group.innerText = 'G';
                        groups_div.appendChild(group);

                        var group = document.createElement('div');
                        group.className = 'textBox group group_H';
                        group.innerText = 'H';
                        groups_div.appendChild(group);

                        document.getElementById('banner').appendChild(groups_div);
                    }

                }

                var game_link = document.createElement('a');
                game_link.className = 'game_link';
                game_link.href = 'http://www.worldcupguess.win/game.html?&id=' + user_id + '&n=' + g;

                var game_div = document.createElement('div');
                game_div.className = 'game'

                if (games[g]['stage'] == 'Groups Stage') {
                    game_div.className += ' group_' + teams[games[g]['home_team']]['groups'];
                }
                var game_number_div = document.createElement('span');
                game_number_div.className = 'textBox game_number';
                game_number_div.innerText = g;


                var home_team_div = document.createElement('span');
                home_team_div.className = 'textBox game_team';
                home_team_div.innerText = games[g]['home_team'];

                var home_team_flag_div = document.createElement('span');
                home_team_flag_div.className = 'team_flag';
                if (games[g]['home_team'] in teams) {
                    team_logo = JSON.parse(teams[games[g]['home_team']]['logo']);
                    if ('src' in team_logo) {
                        var img = document.createElement("IMG")
                        img.className = 'team_flag_img';
                        img.src = team_logo['src'].replace("23","60");;
                        home_team_flag_div.appendChild(img);
                    }
                }

                var date_score_div = document.createElement('span');
                date_score_div.className = 'game_date_score';

                var score_div = document.createElement('span');
                score_div.className = 'textBox game_score';
                score_div.className = 'textBox text_p';
                if (games[g]['score']) {
                    score_div.innerText = games[g]['score'];
                } else {
                    score_div.innerText = ' x ';
                }

                var date_div = document.createElement('span');
                date_div.className = 'textBox game_date';
                date_div.innerText = games[g]['date'];

                date_score_div.appendChild(score_div);
                date_score_div.appendChild(date_div);


                var away_team_flag_div = document.createElement('span');
                away_team_flag_div.className = 'team_flag';
                if (games[g]['away_team'] in teams) {
                    team_logo = JSON.parse(teams[games[g]['away_team']]['logo']);
                    if ('src' in team_logo) {
                        var away_img = document.createElement("IMG")
                        away_img.className = 'team_flag_img';
                        away_img.src = team_logo['src'].replace("23","60");
                        away_team_flag_div.appendChild(away_img);
                    }
                }

                var away_team_div = document.createElement('span');
                away_team_div.className = 'textBox game_team';
                away_team_div.innerText = games[g]['away_team'];

                var stadium_div = document.createElement('span');
                stadium_div.className = 'textBox stadium';
                stadium_div.innerText = games[g]['stadium'];

                game_div.appendChild(game_number_div);
                game_div.appendChild(home_team_div);
                game_div.appendChild(home_team_flag_div);
                game_div.appendChild(date_score_div);
                game_div.appendChild(away_team_flag_div);
                game_div.appendChild(away_team_div);
                game_div.appendChild(stadium_div);

                game_link.appendChild(game_div)

                document.getElementById('banner').appendChild(game_link);
            }
        } else {
            console.error(info);
        }
    }
    xhr.send(null);
}

function get_leaderboard() {
    var url = "http://www.worldcupguess.win:5000/api/v1.0/leaderboard";

    var xhr = new XMLHttpRequest();

    xhr.open("GET", url, true);

    xhr.setRequestHeader('Content-type','application/json; charset=utf-8');

    xhr.onload = function () {
        var leaderboard = JSON.parse(xhr.responseText);
        if (xhr.readyState == 4 && xhr.status == "200") {
            var table = document.getElementById('leaderboard_table')
            for (var i = 0; i < leaderboard.length; i++) {
                console.log(leaderboard[i]);
                var user_row = document.createElement('tr');
                user_row.className = 'user_row';

                if (leaderboard[i].name == document.getElementById('user_name').innerHTML) {
                    user_row.style.backgroundColor = "white";
                    user_row.style.color = "black";
                } else {
                    user_row.style.backgroundColor = "#1E2832";
                }

                var pos = document.createElement('td');
                pos.className = 'user_pos';
                pos.innerText = i + 1;

                var profile_picture = document.createElement('td');
                profile_picture.className = 'user_profile_picture';
                var profile_picture_img = document.createElement('img');
                profile_picture_img.className = 'user_profile_picture_img';
                profile_picture_img.src = leaderboard[i].picture;
                profile_picture.appendChild(profile_picture_img);

                var name = document.createElement('td');
                name.className = 'user_name';
                name.innerText = leaderboard[i].name;

                var exact_score = document.createElement('td');
                exact_score.className = 'user_exact_score';
                exact_score.innerText = leaderboard[i].results.exact_score;

                var right_result = document.createElement('td');
                right_result.className = 'user_right_result';
                right_result.innerText = leaderboard[i].results.right_result;

                var one_right_score = document.createElement('td');
                one_right_score.className = 'user_one_right_score';
                one_right_score.innerText = leaderboard[i].results.one_right_score;

                var fail = document.createElement('td');
                fail.className = 'user_fail';
                fail.innerText = leaderboard[i].results.fail;

                var groups = document.createElement('td');
                groups.className = 'user_groups';
                groups.innerText = leaderboard[i].results.groups;

                var penalties = document.createElement('td');
                penalties.className = 'user_penalties';
                penalties.innerText = leaderboard[i].results.penalties_winner;

                var awards = document.createElement('td');
                awards.className = 'user_awards';
                awards.innerText = leaderboard[i].results.player_best_scorer + leaderboard[i].results.player_mvp;

                var points = document.createElement('td');
                points.className = 'user_points';
                points.innerText = leaderboard[i].points;


                user_row.appendChild(pos);
                user_row.appendChild(profile_picture);
                user_row.appendChild(name);
                user_row.appendChild(exact_score);
                user_row.appendChild(right_result);
                user_row.appendChild(one_right_score);
                user_row.appendChild(fail);
                user_row.appendChild(groups);
                user_row.appendChild(penalties);
                user_row.appendChild(awards);
                user_row.appendChild(points);

                table.appendChild(user_row);
            }

        } else {
            console.error(info);
        }
    }
    xhr.send(null);
}

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

function get_game(user_id, game_num) {
    var url = "http://www.worldcupguess.win:5000/api/v1.0/game";

    var xhr = new XMLHttpRequest();

    xhr.open("GET", url+'/'+user_id+'/'+game_num, true);

    xhr.setRequestHeader('Content-type','application/json; charset=utf-8');

    xhr.onload = function () {
        var game_info = JSON.parse(xhr.responseText);
        if (xhr.readyState == 4 && xhr.status == "200") {
            console.log(game_info)

            var game_div = document.createElement('div');
            game_div.className = 'game'

            if (game_info['info']['stage'] == 'Groups Stage') {
                game_div.className += ' group_' + game_info['teams']['home_team']['groups'];
            }

            var home_team_div = document.createElement('span');
            home_team_div.className = 'textBox game_team';
            home_team_div.innerText = game_info['info']['home_team'];

            var home_team_flag_div = document.createElement('span');
            home_team_flag_div.className = 'team_flag';
            if (game_info['teams']['away_team'] != null) {
                team_logo = JSON.parse(game_info['teams']['home_team']['logo']);
                if ('src' in team_logo) {
                    var img = document.createElement("IMG")
                    img.className = 'team_flag_img';
                    img.src = team_logo['src'].replace("23","60");;
                    home_team_flag_div.appendChild(img);
                }
            }

            var date_score_div = document.createElement('span');
            date_score_div.className = 'game_date_score';

            var score_div = document.createElement('span');
            score_div.className = 'textBox game_score';
            score_div.className = 'textBox text_p';
            if (game_info['info']['score']) {
                score_div.innerText = game_info['info']['score'];
            } else {
                score_div.innerText = ' x ';
            }

            var date_div = document.createElement('span');
            date_div.className = 'textBox game_date';
            date_div.innerText = game_info['info']['date'];

            date_score_div.appendChild(score_div);
            date_score_div.appendChild(date_div);


            var away_team_flag_div = document.createElement('span');
            away_team_flag_div.className = 'team_flag';
            if (game_info['teams']['away_team'] != null) {
                team_logo = JSON.parse(game_info['teams']['away_team']['logo']);
                if ('src' in team_logo) {
                    var away_img = document.createElement("IMG")
                    away_img.className = 'team_flag_img';
                    away_img.src = team_logo['src'].replace("23","60");
                    away_team_flag_div.appendChild(away_img);
                }
            }

            var away_team_div = document.createElement('span');
            away_team_div.className = 'textBox game_team';
            away_team_div.innerText = game_info['info']['away_team'];

            var stadium_div = document.createElement('span');
            stadium_div.className = 'textBox stadium';
            stadium_div.innerText = game_info['info']['stadium'];

            game_div.appendChild(home_team_div);
            game_div.appendChild(home_team_flag_div);
            game_div.appendChild(date_score_div);
            game_div.appendChild(away_team_flag_div);
            game_div.appendChild(away_team_div);
            game_div.appendChild(stadium_div);

            if (game_info.has_started) {

            } else {

            }

            document.getElementById('banner').appendChild(game_div);


        } else {
            console.error(info);
        }
    }
    xhr.send(null);
}
