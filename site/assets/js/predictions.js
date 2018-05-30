function get_my_predictions(user_id) {
    document.title = "My Predictions";

    var url = "http://www.worldcupguess.win:5000/api/v1.0/predictions";

    var xhr = new XMLHttpRequest();

    xhr.open("GET", url+'/'+user_id, true);

    console.log("user_id:",user_id);

    xhr.setRequestHeader('Content-type','application/json; charset=utf-8');

    var nav_elements = document.getElementsByClassName('selected');
    for (var i = 0; i < nav_elements.length; i++) {
        nav_elements[i].className = '';
    }

    var my_predictions_nav = document.getElementById('my_predictions');
    my_predictions_nav.className = 'selected';

    xhr.onload = function () {
        var banner = document.getElementById('banner');

        banner.scrollTop = 0;

        var data = JSON.parse(xhr.responseText);
        if (xhr.readyState == 4 && xhr.status == "200") {
            previous_stage = "";
            games = data['games'];
            teams = data['teams'];
            predictions = data['predictions'];

            console.log(predictions);

            while (banner.firstChild) {
                banner.removeChild(banner.firstChild);
            }

            var groups_div = document.createElement('div');
            groups_div.className = 'groups';

            var groups = ['A','B','C','D','E','F','G','H'];

            for (var i = 0; i < groups.length; i++) {

                var group_link = document.createElement('div');

                var closureMaker = function(anchor) {
                    return function(){window.location.href = "#"+anchor;};
                }
                var closure = closureMaker(groups[i]);
                group_link.addEventListener('click', closure, false);

                group_link.className = 'group group_' + groups[i];

                var group = document.createElement('div');
                group.className = 'textBox group_link';
                group.innerText = groups[i];
                group_link.appendChild(group);
                groups_div.appendChild(group_link);
            }

            banner.appendChild(groups_div);

            games_order = ['A','B','C','D','E','F','G','H','Round of 16','Quarter-finals','Semi-finals','Third place play-off','Final']

            for (var i = 0; i < games_order.length; i++) {

                g = games_order[i];

                var stage_div = document.createElement('div');
                stage_div.className = 'stage_div textBox';
                stage_div.id = g;
                stage_div.innerText = g;
                banner.appendChild(stage_div);

                var schedule_table = document.createElement('table');
                schedule_table.className = 'game_table';

                for(var game in games[g]) {
                    game_info = games[g][game]['game'];

                    var schedule_row = document.createElement('tr');
                    schedule_row.className = 'game_row';

                    if (game_info['stage'] == 'Groups Stage') {
                        schedule_row.className += ' group_' + teams[game_info['home_team']]['groups'];
                    }

                    var game_td = document.createElement('td');
                    game_td.className = game

                    var game_number_td = document.createElement('td');
                    game_number_td.className = 'game_number';

                    var game_link = document.createElement('a');
                    game_link.href = 'http://www.worldcupguess.win/game.html?&id=' + user_id + '&n=' + g;
                    game_link.innerText = games[g][game]['game_number'];
                    game_link.className = 'game_link';
                    game_number_td.appendChild(game_link);

                    var home_team_td = document.createElement('td');
                    home_team_td.className = 'game_team';
                    home_team_td.innerText = game_info['home_team'];

                    var home_team_flag_td = document.createElement('td');
                    home_team_flag_td.className = 'team_flag';
                    if (game_info['home_team'] in teams) {
                        team_logo = JSON.parse(teams[game_info['home_team']]['logo']);
                        if ('src' in team_logo) {
                            var img = document.createElement("IMG")
                            img.className = 'team_flag_img';
                            img.src = team_logo['src'].replace("23","60");;
                            home_team_flag_td.appendChild(img);
                        }
                    }

                    var home_team_guess_td = document.createElement('td');
                    if (game_info['home_team'] in teams && game_info['away_team'] in teams) {
                        home_team_guess_td.className = 'home_team_guess';
                        var home_team_guess_input = document.createElement('input');
                        home_team_guess_input.className = 'guess_input';
                        home_team_guess_input.type = "number";

                        var closureMaker = function(user_id) {
                            return function(){send_predictions(user_id)};
                        }
                        var closure = closureMaker(user_id);
                        home_team_guess_input.addEventListener('change', closure, false);
                        home_team_guess_td.appendChild(home_team_guess_input);
                    }

                    var date_score_td = document.createElement('td');
                    date_score_td.className = 'game_date_score';

                    if (game_info['score']) {
                        date_score_td.innerText = game_info['score'];
                    } else {
                        var date = new Date(game_info['date']);
                        date_score_td.innerText = date.getDate() + ' ' + monthNames[date.getMonth()] + ' @ ' + date.getHours();
                    }


                    var away_team_guess_td = document.createElement('td');
                    if (game_info['home_team'] in teams && game_info['away_team'] in teams) {
                        away_team_guess_td.className = 'away_team_guess';
                        var away_team_guess_input = document.createElement('input');
                        away_team_guess_input.className = 'guess_input';
                        away_team_guess_input.type = "number";
                        var closureMaker = function(user_id) {
                            return function(){send_predictions(user_id)};
                        }
                        var closure = closureMaker(user_id);
                        away_team_guess_input.addEventListener('change', closure, false);
                        away_team_guess_td.appendChild(away_team_guess_input);
                    }

                    var away_team_flag_td = document.createElement('td');
                    away_team_flag_td.className = 'team_flag';
                    if (game_info['away_team'] in teams) {
                        team_logo = JSON.parse(teams[game_info['away_team']]['logo']);
                        if ('src' in team_logo) {
                            var away_img = document.createElement("IMG")
                            away_img.className = 'team_flag_img';
                            away_img.src = team_logo['src'].replace("23","60");
                            away_team_flag_td.appendChild(away_img);
                        }
                    }

                    var away_team_td = document.createElement('td');
                    away_team_td.className = 'game_team';
                    away_team_td.innerText = game_info['away_team'];

                    schedule_row.appendChild(game_number_td);
                    schedule_row.appendChild(home_team_td);
                    schedule_row.appendChild(home_team_flag_td);
                    schedule_row.appendChild(home_team_guess_td);
                    schedule_row.appendChild(date_score_td);
                    schedule_row.appendChild(away_team_guess_td);
                    schedule_row.appendChild(away_team_flag_td);
                    schedule_row.appendChild(away_team_td);

                    schedule_table.appendChild(schedule_row);
                }
                banner.appendChild(schedule_table);
            }
            set_predictions_default(predictions);
        } else {
            console.error(data);
        }
    }
    xhr.send(null);
}

function send_predictions(user_id) {
    games = document.getElementsByClassName('game_row');

    var predictions = {};

    for(var i = 0; i < games.length; i++) {
        game_number = games[i].getElementsByClassName('game_number')[0].innerText;

        home_guesses = games[i].getElementsByClassName('home_team_guess');
        away_guesses = games[i].getElementsByClassName('away_team_guess');

        home_guess = '';
        if (home_guesses != null && home_guesses.results != null && home_guesses.results.length > 0) {
            console.log(home_guess, away_guess)
            home_guess = home_guesses[0].firstChild.value;
        }
        away_guess = '';
        if (away_guesses != null && away_guesses.results != null && away_guesses.results.length > 0) {
            away_guess = away_guesses[0].firstChild.value;
        }

        if ((home_guess != '') || (away_guess != '')) {
            predictions[game_number] = {'home_guess':home_guess, 'away_guess':away_guess};
        }
    }
    console.log(predictions)
    var url = "http://www.worldcupguess.win:5000/api/v1.0/predictions";

    var json = JSON.stringify({'predictions':predictions});

    var xhr = new XMLHttpRequest();
    xhr.open("POST", url + '/' + user_id, true);
    xhr.setRequestHeader('Content-type','application/json; charset=utf-8');
    xhr.onload = function () {
        var groups = JSON.parse(xhr.responseText);
        if (xhr.readyState == 4 && xhr.status == "201") {
            console.log(groups);
        } else {
            console.error(groups);
        }
    }
    xhr.send(json);
}

function set_predictions_default(predictions) {
    games = document.getElementsByClassName('game_row');

    for(var i = 0; i < games.length; i++) {
        game_number = games[i].getElementsByClassName('game_number')[0].innerText;

        if (game_number in predictions) {
            games[i].getElementsByClassName('home_team_guess')[0].firstChild.defaultValue = predictions[game_number]['home_guess'];
            games[i].getElementsByClassName('away_team_guess')[0].firstChild.defaultValue = predictions[game_number]['away_guess'];
        }
    }
}