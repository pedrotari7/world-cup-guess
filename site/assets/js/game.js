function get_game(user_id, game_num) {
    document.title = "Game " + game_num;

    var url = "http://www.worldcupguess.win:5000/api/v1.0/game";

    var xhr = new XMLHttpRequest();

    testConnection();

    xhr.open("GET", url+'/'+user_id+'/'+game_num, true);

    xhr.setRequestHeader('Content-type','application/json; charset=utf-8');

    var nav_elements = document.getElementsByClassName('selected');
    for (var i = 0; i < nav_elements.length; i++) {
        nav_elements[i].className = '';
    }

    xhr.onload = function () {

        var game_info = JSON.parse(xhr.responseText);
        if (xhr.readyState == 4 && xhr.status == "200") {

            var banner = document.getElementById('banner');
            banner.scrollTop = 0;

            while (banner.firstChild) {
                banner.removeChild(banner.firstChild);
            }

            var game_table = document.createElement('table');
            game_table.className = 'game_table';

            var game_row = document.createElement('tr');
            game_row.className = 'game_row';

            if (game_info['info']['stage'] == 'Groups Stage') {
                game_row.className += ' group_' + game_info['teams']['home_team']['groups'];
            }

            var game_td = document.createElement('td');
            game_td.className = 'game'

            var home_team_td = document.createElement('td');
            home_team_td.className = 'game_team';
            home_team_td.innerText = game_info['info']['home_team'];

            var home_team_flag_td = document.createElement('td');
            home_team_flag_td.className = 'team_flag';
            if (game_info['info']['home_team']) {
                team_logo = JSON.parse(game_info['teams']['home_team']['logo']);
                if ('src' in team_logo) {
                    var img = document.createElement("IMG")
                    img.className = 'team_flag_img';
                    img.src = team_logo['src'].replace("23","60");;
                    home_team_flag_td.appendChild(img);
                }
            }

            var closureMaker = function(user_id, team) {
                return function(){get_players(user_id, team)};
            }
            var closure = closureMaker(user_id, game_info['info']['home_team']);
            home_team_flag_td.addEventListener('click', closure, false);
            home_team_td.addEventListener('click', closure, false);


            var date_score_td = document.createElement('td');
            date_score_td.className = 'game_date_score';


            if (game_info['has_started']) {
                if (game_info['info']['score'] && game_info['info']['score']['home'] && game_info['info']['score']['away']) {
                    if(!game_info['info']['score']['finished'])
                        date_score_td.innerHTML += '<blink>  &#9679;   </blink>'
                    date_score_td.innerHTML += game_info['info']['score']['home'] + ' x ' + game_info['info']['score']['away'];
                    if(game_info['info']['score']['home_penalties'] && game_info['info']['score']['away_penalties']) {
                        date_score_td.innerHTML += ' (' + game_info['info']['score']['home_penalties'] + ' - ' + game_info['info']['score']['away_penalties'] + ')';
                    }
                } else {
                    date_score_td.innerText += ' x '
                }

                date_score_td.style.fontSize = '20px';

            } else {
                var date = new Date(game_info['info']['date']);
                var current_date = new Date(game_info['current_time']);

                var time_diff = (date.getTime() - current_date.getTime() + 2*60*60*1000) / 1000;
                var one_day = 60*60*24;

                if(time_diff < one_day) {
                    date_score_td.style.fontSize = '20px';
                    startTimer(time_diff, date_score_td, user_id, game_num)
                } else {
                    date_score_td.innerText = date.getDate() + ' ' + monthNames[date.getMonth()] + ' @ ' + date.getHours();
                }
            }
            var away_team_flag_td = document.createElement('td');
            away_team_flag_td.className = 'team_flag';
            if (game_info['info']['away_team']) {
                team_logo = JSON.parse(game_info['teams']['away_team']['logo']);
                if ('src' in team_logo){
                    var away_img = document.createElement("IMG")
                    away_img.className = 'team_flag_img';
                    away_img.src = team_logo['src'].replace("23","60");
                    away_team_flag_td.appendChild(away_img);
                }
            }

            var closureMaker = function(user_id, team) {
                return function(){get_players(user_id, team)};
            }
            var closure = closureMaker(user_id, game_info['info']['away_team']);
            away_team_flag_td.addEventListener('click', closure, false);


            var away_team_td = document.createElement('td');
            away_team_td.className = 'game_team';
            away_team_td.innerText = game_info['info']['away_team'];

            away_team_td.addEventListener('click', closure, false);

            game_row.appendChild(home_team_td);
            game_row.appendChild(home_team_flag_td);
            game_row.appendChild(date_score_td);
            game_row.appendChild(away_team_flag_td);
            game_row.appendChild(away_team_td);

            game_table.appendChild(game_row);

            var game_prediction_table = document.createElement('table');
            game_prediction_table.id = 'game_prediction_table';

            console.log(game_info['predictions'])

            for (var p = 0; p <  game_info['predictions'].length; p++) {
                var user = game_info['predictions'][p][0];
                var prediction = game_info['predictions'][p][1];

                var user_row = document.createElement('tr');
                user_row.className = 'user_row';

                var profile_picture = document.createElement('td');
                profile_picture.className = 'user_profile_picture';
                var profile_picture_img = document.createElement('img');
                profile_picture_img.className = 'user_profile_picture_img';
                profile_picture_img.src = prediction.picture;
                profile_picture.appendChild(profile_picture_img);

                var name = document.createElement('td');
                name.className = 'user_name';
                name.innerText = user;

                var game_prediction_score = document.createElement('td');
                game_prediction_score.className = 'game_prediction_score';

                home_prediction = '';
                if (prediction.hasOwnProperty('prediction') && prediction.prediction.hasOwnProperty('home')) {
                    home_prediction = prediction.prediction['home'];
                }
                away_prediction = '';
                if (prediction.hasOwnProperty('prediction') && prediction.prediction.hasOwnProperty('away')) {
                    away_prediction = prediction.prediction['away'];
                }
                game_prediction_score.innerText = home_prediction + ' - ' + away_prediction;


                if (prediction.hasOwnProperty('prediction') && prediction.prediction.hasOwnProperty('result')) {
                    user_row.className += ' game_result_' + prediction['prediction']['result'];
                }

                user_row.appendChild(profile_picture);
                user_row.appendChild(name);
                user_row.appendChild(game_prediction_score);

                var closureMaker = function(a, b) {
                    return function(){get_my_predictions(a, b);};
                }
                var closure = closureMaker(user_id, user);
                user_row.addEventListener('click', closure, false);

                if (user == document.getElementById('user_name').innerHTML) {
                    user_row.className += ' its_me';
                } else {
                    user_row.style.backgroundColor = "#474748";
                }

                game_prediction_table.appendChild(user_row);

            }

            banner.appendChild(game_table);
            banner.appendChild(game_prediction_table);

        } else {
            console.error(info);
        }
    }
    xhr.send(null);
}