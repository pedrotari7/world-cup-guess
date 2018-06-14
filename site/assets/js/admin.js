function get_admin(user_id) {
    document.title = "Admin";

    var url = "http://www.worldcupguess.win:5000/api/v1.0/schedule";

    testConnection();

    var xhr = new XMLHttpRequest();

    xhr.open("GET", url, true);

    xhr.setRequestHeader('Content-type','application/json; charset=utf-8');

    var nav_elements = document.getElementsByClassName('selected');
    for (var i = 0; i < nav_elements.length; i++) {
        nav_elements[i].className = '';
    }

    user_name = document.getElementById('user');
    user_name.style.color = "white";

    xhr.onload = function () {
        var banner = document.getElementById('banner');
        banner.scrollTop = 0;
        var info = JSON.parse(xhr.responseText);
        if (xhr.readyState == 4 && xhr.status == "200") {
            previous_stage = "";
            games_order = info['games_order'];
            games = info['games_info']['games'];
            teams = info['games_info']['teams'];

            while (banner.firstChild) {
                banner.removeChild(banner.firstChild);
            }

            var groups_div = document.createElement('div');
            groups_div.className = 'groups';

            var groups = ['A','B','C','D','E','F','G','H'];

            for (var i = 0; i < groups.length; i++) {
                var group_link = document.createElement('div');
                group_link.className = 'group group_' + groups[i];
                var group = document.createElement('div');
                group.className = 'textBox';
                group.innerText = groups[i];
                group_link.appendChild(group);
                groups_div.appendChild(group_link);
            }

            banner.appendChild(groups_div);

            var schedule_table = document.createElement('table');
            schedule_table.className = 'game_table';

            for (var k = 0; k < games_order.length; k++) {
                g = games_order[k];

                var schedule_row = document.createElement('tr');
                schedule_row.className = 'game_row';

                if (games[g]['stage'] == 'Groups Stage') {
                    schedule_row.className += ' group_' + teams[games[g]['home_team']]['groups'];
                }

                var game_td = document.createElement('td');
                game_td.className = 'game'

                var game_number_td = document.createElement('td');
                game_number_td.className = 'game_number';

                var game_link = document.createElement('a');
                game_link.innerText = g;
                game_link.className = 'game_link';
                var closureMaker = function(user_id, game_number) {
                    return function(){get_game(user_id, game_number)};
                }
                var closure = closureMaker(user_id, g);
                game_number_td.addEventListener('click', closure, false);

                game_number_td.appendChild(game_link);


                var home_team_td = document.createElement('td');
                home_team_td.className = 'game_team';
                home_team_td.innerText = games[g]['home_team'];

                var home_team_flag_td = document.createElement('td');
                home_team_flag_td.className = 'team_flag';
                if (games[g]['home_team'] in teams) {
                    team_logo = JSON.parse(teams[games[g]['home_team']]['logo']);
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
                var closure = closureMaker(user_id, games[g]['home_team']);
                home_team_flag_td.addEventListener('click', closure, false);
                home_team_td.addEventListener('click', closure, false);


                var home_team_result_td = document.createElement('td');
                if (games[g]['home_team'] in teams && games[g]['away_team'] in teams) {
                    home_team_result_td.className = 'home_team_guess';
                    var home_team_result_input = document.createElement('input');
                    home_team_result_input.className = 'guess_input';
                    home_team_result_input.id = 'home_guess_' + g;
                    home_team_result_input.type = "number";

                    var closureMaker = function(user_id, game_number) {
                        return function(){send_results(user_id, game_number)};
                    }
                    var closure = closureMaker(user_id, g);
                    home_team_result_input.addEventListener('change', closure, false);

                    if (!games[g]['has_started']) {
                        home_team_result_input.style.borderColor = 'transparent';
                        home_team_result_input.disabled = true;
                    } else {
                        home_team_result_input.style.borderColor = "rgb(255, 255, 255, 0.3)";
                    }
                    if (games[g]['score']) {
                        home_team_result_input.value = games[g]['score']['home'];
                    }
                    home_team_result_td.appendChild(home_team_result_input);

                    if (games[g]['stage'] != 'Groups Stage' && games[g]['score'] && games[g]['score']['home'] == games[g]['score']['away']) {
                        var home_team_penalties_input = document.createElement('input');
                        home_team_penalties_input.className = 'guess_input';
                        home_team_penalties_input.id = 'home_penalties_' + g;
                        home_team_penalties_input.type = "number";

                        var closureMaker = function(user_id, game_number) {
                            return function(){send_results(user_id, game_number)};
                        }
                        var closure = closureMaker(user_id, g);
                        home_team_penalties_input.addEventListener('change', closure, false);

                        if (!games[g]['has_started']) {
                            home_team_penalties_input.style.borderColor = 'transparent';
                            home_team_penalties_input.disabled = true;
                        } else {
                            home_team_penalties_input.style.borderColor = "rgb(255, 255, 255, 0.3)";
                        }
                        if (games[g]['score']) {
                            home_team_penalties_input.value = games[g]['score']['home_penalties'];
                        }
                        home_team_result_td.appendChild(home_team_penalties_input);
                    }
                }



                var date_score_td = document.createElement('td');
                date_score_td.className = 'game_date_score';

                var date = new Date(games[g]['date'].replace(' ','T'));
                var hours = date.getHours();
                var isSafari = window.safari !== undefined;
                if (isSafari)
                    hours -= 2;
                date_score_td.innerText = date.getDate() + ' ' + monthNames[date.getMonth()] + ' @ ' + hours;

                var away_team_result_td = document.createElement('td');
                if (games[g]['away_team'] in teams && games[g]['away_team'] in teams) {
                    away_team_result_td.className = 'away_team_guess';
                    var away_team_result_input = document.createElement('input');
                    away_team_result_input.className = 'guess_input';
                    away_team_result_input.id = 'away_guess_' + g;
                    away_team_result_input.type = "number";

                    var closureMaker = function(user_id, game_number) {
                        return function(){send_results(user_id, game_number)};
                    }
                    var closure = closureMaker(user_id, g);
                    away_team_result_input.addEventListener('change', closure, false);

                    if (!games[g]['has_started']) {
                        away_team_result_input.style.borderColor = 'transparent';
                        away_team_result_input.disabled = true;
                    } else {
                        away_team_result_input.style.borderColor = "rgb(255 ,255, 255, 0.3)";
                    }
                    if (games[g]['score']) {
                        away_team_result_input.value = games[g]['score']['away'];
                    }

                    away_team_result_td.appendChild(away_team_result_input);

                    if (games[g]['stage'] != 'Groups Stage' && games[g]['score'] && games[g]['score']['home'] == games[g]['score']['away']) {
                        var away_team_penalties_input = document.createElement('input');
                        away_team_penalties_input.className = 'guess_input';
                        away_team_penalties_input.id = 'away_penalties_' + g;
                        away_team_penalties_input.type = "number";

                        var closureMaker = function(user_id, game_number) {
                            return function(){send_results(user_id, game_number)};
                        }
                        var closure = closureMaker(user_id, g);
                        away_team_penalties_input.addEventListener('change', closure, false);

                        if (!games[g]['has_started']) {
                            away_team_penalties_input.style.borderColor = 'transparent';
                            away_team_penalties_input.disabled = true;
                        } else {
                            away_team_penalties_input.style.borderColor = "rgb(255, 255, 255, 0.3)";
                        }
                        if (games[g]['score']) {
                            away_team_penalties_input.value = games[g]['score']['away_penalties'];
                        }
                        away_team_result_td.appendChild(away_team_penalties_input);
                    }


                }

                var away_team_flag_td = document.createElement('td');
                away_team_flag_td.className = 'team_flag';
                if (games[g]['away_team'] in teams) {
                    team_logo = JSON.parse(teams[games[g]['away_team']]['logo']);
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
                var closure = closureMaker(user_id, games[g]['away_team']);
                away_team_flag_td.addEventListener('click', closure, false);

                var away_team_td = document.createElement('td');
                away_team_td.className = 'game_team';
                away_team_td.innerText = games[g]['away_team'];

                away_team_td.addEventListener('click', closure, false);

                var game_finished_td = document.createElement('td');
                game_finished_td.className = 'game_finished_checkbox';
                var game_finished = document.createElement('input');
                game_finished.className = 'checkbox';
                game_finished.id = 'checkbox_' + g;
                game_finished.type = 'checkbox';
                game_finished.style.visibility = 'hidden';
                if (games[g]['score'] && games[g]['score']['home'] && games[g]['score']['away']) {
                    game_finished.style.visibility = 'visible';
                    game_finished.checked = games[g]['score']['finished'];
                }

                var closureMaker = function(user_id, game_number) {
                    return function(){send_results(user_id, game_number)};
                }
                var closure = closureMaker(user_id, g);
                game_finished.addEventListener('change', closure, false);

                game_finished_td.appendChild(game_finished);

                if (games[g]['score']['finished']) {
                    home_team_result_input.style.borderColor = 'transparent';
                    home_team_result_input.disabled = true;
                    away_team_result_input.style.borderColor = 'transparent';
                    away_team_result_input.disabled = true;
                    if (typeof(home_team_penalties_input) !== 'undefined') {
                        home_team_penalties_input.style.borderColor = 'transparent';
                        home_team_penalties_input.disabled = true;
                    }
                    if (typeof(away_team_penalties_input) !== 'undefined') {
                        away_team_penalties_input.style.borderColor = 'transparent';
                        away_team_penalties_input.disabled = true;
                    }
                }

                schedule_row.appendChild(game_number_td);
                schedule_row.appendChild(home_team_td);
                schedule_row.appendChild(home_team_flag_td);
                schedule_row.appendChild(home_team_result_td);
                schedule_row.appendChild(date_score_td);
                schedule_row.appendChild(away_team_result_td);
                schedule_row.appendChild(away_team_flag_td);
                schedule_row.appendChild(away_team_td);
                schedule_row.appendChild(game_finished_td);

                schedule_table.appendChild(schedule_row);
            }

            banner.appendChild(schedule_table);

        } else {
            console.error(info);
        }
    }
    xhr.send(null);
}

function send_results(user_id, game_number) {
    var results = {};

    home_guess = document.getElementById('home_guess_' + game_number);
    away_guess = document.getElementById('away_guess_' + game_number);
    home_penalties = document.getElementById('home_penalties_' + game_number);
    away_penalties = document.getElementById('away_penalties_' + game_number);
    finished = document.getElementById('checkbox_' + game_number);

    if (home_guess != null) {
        if (finished.checked) {
            home_guess.style.borderColor= 'transparent';
            home_guess.disabled = true;
        } else {
            home_guess.style.borderColor= "rgb(255 , 255, 255, 0.3)";
            home_guess.disabled = false;
        }
        home_guess = home_guess.value;
    } else {
        home_guess = '';
    }

    if (away_guess != null) {
        if (finished.checked) {
            away_guess.style.borderColor= 'transparent';
            away_guess.disabled = true;
        } else {
            away_guess.style.borderColor= "rgb(255, 255, 255, 0.3)";
            away_guess.disabled = false;
        }
        away_guess = away_guess.value;
    } else {
        away_guess = '';
    }

    if (home_penalties != null) {
        if (finished.checked) {
            home_penalties.style.borderColor= 'transparent';
            home_penalties.disabled = true;
        } else {
            home_penalties.style.borderColor= "rgb(255 , 255, 255, 0.3)";
            home_penalties.disabled = false;
        }
        home_penalties = home_penalties.value;
    } else {
        home_penalties = '';
    }

    if (away_penalties != null) {
        if (finished.checked) {
            away_penalties.style.borderColor= 'transparent';
            away_penalties.disabled = true;
        } else {
            away_penalties.style.borderColor= "rgb(255, 255, 255, 0.3)";
            away_penalties.disabled = false;
        }
        away_penalties = away_penalties.value;
    } else {
        away_penalties = '';
    }

    results[game_number] = {'home':home_guess,
                            'away':away_guess,
                            'home_penalties':home_penalties,
                            'away_penalties':away_penalties,
                            'finished':finished.checked};

    if ((home_guess != '') && (away_guess != '')) {
        finished.style.visibility = 'visible';
    } else {
        finished.style.visibility = 'hidden';
    }


    var url = "http://www.worldcupguess.win:5000/api/v1.0/results";

    testConnection()

    var json = JSON.stringify({'results':results});

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