function get_my_predictions(user_id, predictions_user_name) {
    var url = "http://www.worldcupguess.win:5000/api/v1.0/predictions";

    testConnection();

    var xhr = new XMLHttpRequest();

    xhr.open("GET", url + '/' + user_id + '/' + predictions_user_name, true);

    xhr.setRequestHeader('Content-type','application/json; charset=utf-8');

    var nav_elements = document.getElementsByClassName('selected');
    for (var i = 0; i < nav_elements.length; i++) {
        nav_elements[i].className = '';
    }

    var is_my_predictions = predictions_user_name == document.getElementById('user_name').innerHTML;

    if (is_my_predictions) {
        var my_predictions_nav = document.getElementById('my_predictions');
        my_predictions_nav.className = 'selected';
        document.title = "My Predictions";
    } else {
        document.title = predictions_user_name;
    }

    xhr.onload = function () {
        var banner = document.getElementById('banner');

        banner.scrollTop = 0;

        var data = JSON.parse(xhr.responseText);
        if (xhr.readyState == 4 && xhr.status == "200") {
            previous_stage = "";
            games = data['games'];
            teams = data['teams'];
            predictions = data['predictions'];
            predicted_groups = data['predicted_groups'];
            real_groups = data['real_groups'];

            console.log(games);

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

            if (!is_my_predictions) {
                var predictions_user_div = document.createElement('div');
                predictions_user_div.innerText = predictions_user_name + ' Predictions';
                predictions_user_div.className = 'stage_div textBox';
                banner.appendChild(predictions_user_div);
            }

            var mvp_div = document.createElement('div');
            mvp_div.className = 'stage_div textBox';
            mvp_div.innerText = 'MVP: ';


            if(is_my_predictions && data['mvp'] == 'available_to_select') {
                mvp_div.innerText += 'Click to predict...';
                var closureMaker = function(user_id, mode) {
                    return function(){get_teams(user_id, mode)};
                }
                var closure = closureMaker(user_id, 'mvp');
                mvp_div.addEventListener('click', closure, false);
            } else {
                mvp_div.innerText += data['mvp'];
            }

            banner.appendChild(mvp_div);

            var top_scorer_div = document.createElement('div');
            top_scorer_div.className = 'stage_div textBox';
            top_scorer_div.innerText = 'Top Scorer: ';

            if(is_my_predictions && data['top_scorer'] == 'available_to_select') {
                top_scorer_div.innerText += 'Click to predict...';
                var closureMaker = function(user_id, mode) {
                    return function(){get_teams(user_id, mode)};
                }
                var closure = closureMaker(user_id, 'top_scorer');
                top_scorer_div.addEventListener('click', closure, false);
            } else {
                top_scorer_div.innerText += data['top_scorer'];
            }


            banner.appendChild(top_scorer_div);


            games_order = ['A','B','C','D','E','F','G','H','Round of 16','Quarter-finals','Semi-finals','Third place play-off','Final']

            for (var i = 0; i < games_order.length; i++) {

                g = games_order[i];

                var stage_div = document.createElement('div');
                stage_div.className = 'stage_div textBox';
                stage_div.id = g;
                if (g.length > 1)
                    stage_div.innerText = g;
                else
                    stage_div.innerText = 'Group ' + g;

                banner.appendChild(stage_div);

                // Group Table

                if (g.length == 1) {

                    var group_tables_div = document.createElement('div');
                    group_tables_div.className = 'group_table_div';

                    var real_group_table = document.createElement('table');
                    real_group_table.className = 'group_table real_group_table group_table_' + g
                    real_group_table.createCaption();
                    real_group_table.caption.innerHTML = 'Real'
                    real_group_table.caption.style.fontWeight = 'bold';

                    var predicted_group_table = document.createElement('table');
                    predicted_group_table.className = 'group_table predicted_group_table group_table_' + g
                    predicted_group_table.id = 'group_table_' + g
                    predicted_group_table.createCaption();
                    predicted_group_table.caption.innerHTML = 'Predicted';
                    predicted_group_table.caption.style.fontWeight = 'bold';

                    var header_row = document.createElement('tr');
                    header_row.className = 'group_header'

                    var team_header = document.createElement('td');
                    team_header.className = 'table_td team_td';
                    team_header.innerText = ''

                    var games_header = document.createElement('td');
                    games_header.className = 'table_td';
                    games_header.innerText = 'G'

                    var wins_header = document.createElement('td');
                    wins_header.className = 'table_td';
                    wins_header.innerText = 'W'

                    var draws_header = document.createElement('td');
                    draws_header.className = 'table_td';
                    draws_header.innerText = 'D'

                    var losses_header = document.createElement('td');
                    losses_header.className = 'table_td';
                    losses_header.innerText = 'L'

                    var goals_scored_header = document.createElement('td');
                    goals_scored_header.className = 'table_td';
                    goals_scored_header.innerText = 'GS'

                    var goals_conceded_header = document.createElement('td');
                    goals_conceded_header.className = 'table_td';
                    goals_conceded_header.innerText = 'GC'

                    var goal_difference_header = document.createElement('td');
                    goal_difference_header.className = 'table_td';
                    goal_difference_header.innerText = 'GD'

                    var points_header = document.createElement('td');
                    points_header.className = 'table_td';
                    points_header.innerText = 'PTS';

                    header_row.append(team_header);
                    header_row.append(games_header);
                    header_row.append(wins_header);
                    header_row.append(draws_header);
                    header_row.append(losses_header);
                    header_row.append(goals_scored_header);
                    header_row.append(goals_conceded_header);
                    header_row.append(goal_difference_header);
                    header_row.append(points_header);

                    // Real Table
                    real_group_table.appendChild(header_row);
                    real_group_table = fill_in_group_table(user_id, teams, real_groups[g], real_group_table);
                    group_tables_div.appendChild(real_group_table);

                    if (predicted_groups.hasOwnProperty(g)) {
                        // Predicted Table
                        predicted_group_table.appendChild(header_row.cloneNode(true));
                        predicted_group_table = fill_in_group_table(user_id, teams, predicted_groups[g], predicted_group_table, 'predicted', real_groups[g]);
                        group_tables_div.appendChild(predicted_group_table);
                    } else {
                        real_group_table.style.width = '98%';
                    }


                    banner.appendChild(group_tables_div);
                }
                // Group Result

                var schedule_table = document.createElement('table');
                schedule_table.className = 'game_table';

                for(var game in games[g]) {
                    game_info = games[g][game]['game'];

                    var schedule_row = document.createElement('tr');
                    schedule_row.className = 'game_row';

                    if (game_info['has_started'] && predictions.hasOwnProperty(games[g][game]['game_number']) && predictions[games[g][game]['game_number']].hasOwnProperty('result')) {
                        schedule_row.className += ' prediction_result_' + predictions[games[g][game]['game_number']]['result']
                    }

                    if (game_info['stage'] == 'Groups Stage') {
                        schedule_row.className += ' group_' + teams[game_info['home_team']]['groups'];
                    }

                    var game_td = document.createElement('td');
                    game_td.className = game

                    var game_number_td = document.createElement('td');
                    game_number_td.className = 'game_number';

                    var game_link = document.createElement('a');
                    game_link.innerText = games[g][game]['game_number'];
                    game_link.className = 'game_link';

                    var closureMaker = function(user_id, game_number) {
                        return function(){get_game(user_id, game_number)};
                    }
                    var closure = closureMaker(user_id, games[g][game]['game_number']);
                    game_number_td.addEventListener('click', closure, false);

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

                    var closureMaker = function(user_id, team) {
                        return function(){get_players(user_id, team)};
                    }
                    var closure = closureMaker(user_id, game_info['home_team']);
                    home_team_flag_td.addEventListener('click', closure, false);

                    var home_team_guess_td = document.createElement('td');
                    if (game_info['home_team'] in teams && game_info['away_team'] in teams) {
                        home_team_guess_td.className = 'home_team_guess';
                        var home_team_guess_input = document.createElement('input');
                        home_team_guess_input.className = 'guess_input';
                        home_team_guess_input.id = 'home_score_' + games[g][game]['game_number'];
                        if(is_my_predictions && !game_info['has_started']) {
                            home_team_guess_input.type = "number";
                            var closureMaker = function(user_id, game_number, teams) {
                                return function(){send_predictions(user_id, game_number, teams)};
                            }
                            var closure = closureMaker(user_id, games[g][game]['game_number'], teams);
                            home_team_guess_input.addEventListener('change', closure, false);
                        } else {
                            home_team_guess_input.disabled = true;
                            home_team_guess_input.style.border = 0;
                        }
                        home_team_guess_td.appendChild(home_team_guess_input);
                    }

                    home_team_guess_input.style.borderColor = "#8B0000";

                    var date_score_td = document.createElement('td');
                    date_score_td.className = 'game_date_score';

                    if (game_info['score'] && game_info['score']['home'] && game_info['score']['away']) {
                        if(!game_info['score']['finished'])
                            date_score_td.innerHTML += '<blink>  &#9679;   </blink>'
                        date_score_td.innerHTML += game_info['score']['home'] + ' x ' + game_info['score']['away'];
                        date_score_td.style.fontSize = '20px';
                    } else {
                        var date = new Date(game_info['date']);
                        date_score_td.innerText = date.getDate() + ' ' + monthNames[date.getMonth()] + ' @ ' + date.getHours();
                    }


                    var away_team_guess_td = document.createElement('td');
                    if (game_info['home_team'] in teams && game_info['away_team'] in teams) {
                        away_team_guess_td.className = 'away_team_guess';
                        var away_team_guess_input = document.createElement('input');
                        away_team_guess_input.className = 'guess_input';
                        away_team_guess_input.id = 'away_score_' + games[g][game]['game_number'];

                        if (is_my_predictions && !game_info['has_started']) {
                            away_team_guess_input.type = "number";
                            var closureMaker = function(user_id, game_number, teams) {
                                return function(){send_predictions(user_id, game_number, teams)};
                            }
                            var closure = closureMaker(user_id, games[g][game]['game_number']);
                            away_team_guess_input.addEventListener('change', closure, false);
                        } else {
                            away_team_guess_input.disabled = true;
                            away_team_guess_input.style.border = 0;
                        }
                        away_team_guess_td.appendChild(away_team_guess_input);
                    }

                    away_team_guess_input.style.borderColor = "#8B0000";

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

                    var closureMaker = function(user_id, team) {
                        return function(){get_players(user_id, team)};
                    }
                    var closure = closureMaker(user_id, game_info['away_team']);
                    away_team_flag_td.addEventListener('click', closure, false);


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

function send_predictions(user_id, game_number, teams) {
    games = document.getElementsByClassName('game_row');

    var predictions = {};

    home_guess = document.getElementById('home_score_' + game_number);
    away_guess = document.getElementById('away_score_' + game_number);

    if (home_guess.value == '') {
        home_guess.style.borderColor = "#8B0000";
    } else {
        home_guess.style.borderColor = "#A6E22E";
    }
    if (away_guess.value == '') {
        away_guess.style.borderColor = "#8B0000";
    } else {
        away_guess.style.borderColor = "#A6E22E";
    }

    if (home_guess != null) {
        home_guess = home_guess.value;
    } else {
        home_guess = '';
    }
    if (away_guess != null) {
        away_guess = away_guess.value;
    } else {
        away_guess = '';
    }

    predictions[game_number] = {'home':home_guess, 'away':away_guess};

    var url = "http://www.worldcupguess.win:5000/api/v1.0/predictions";

    testConnection();

    var json = JSON.stringify({'predictions':predictions});

    var xhr = new XMLHttpRequest();
    xhr.open("POST", url + '/' + user_id, true);
    xhr.setRequestHeader('Content-type','application/json; charset=utf-8');
    xhr.onload = function () {
        var data = JSON.parse(xhr.responseText);
        if (xhr.readyState == 4 && xhr.status == "201") {
            groups = data['groups'];
            teams = data['teams'];
            for (var group in groups) {
                table = document.getElementById('group_table_' + group);
                table = fill_in_group_table(user_id, teams, groups[group], table, 'predicted', real_groups[group]);
            }

        } else {
            console.error(groups);
        }
    }
    xhr.send(json);
}

function set_predictions_default(predictions) {

    for (game_number in predictions) {

        var home_team_guess_input = document.getElementById('home_score_' + game_number)
        home_team_guess_input.defaultValue = predictions[game_number]['home'];
        var away_team_guess_input = document.getElementById('away_score_' + game_number)
        away_team_guess_input.defaultValue = predictions[game_number]['away'];

        if (home_team_guess_input.value == '') {
            home_team_guess_input.style.borderColor = "#8B0000";
        } else {
            home_team_guess_input.style.borderColor = "#A6E22E";
        }
        if (away_team_guess_input.value == '') {
            away_team_guess_input.style.borderColor = "#8B0000";
        } else {
            away_team_guess_input.style.borderColor = "#A6E22E";
        }

    }
}

function fill_in_group_table(user_id, teams, group_teams, table, mode, other_results) {

    if (table.childElementCount == 6) {
        for (var j = 0; j < 4; j++) {
            table.removeChild(table.lastChild);
        }
    }

    for (var j = 0; j < 4; j++) {
        var group_table_row = document.createElement('tr');
        group_table_row.className = 'group_table_row';

        var team_table = document.createElement('td');
        team_table.className = 'table_td team_td';

        team_logo = JSON.parse(teams[group_teams[j]['team']]['logo']);
        if ('src' in team_logo) {
            var team_table_img = document.createElement("IMG")
            team_table_img.className = 'team_table_flag_img';
            team_table_img.src = team_logo['src'].replace("23","60");
            team_table.appendChild(team_table_img);
        }

        var closureMaker = function(user_id, team) {
            return function(){get_players(user_id, team)};
        }
        var closure = closureMaker(user_id, group_teams[j]['team']);
        team_table_img.addEventListener('click', closure, false);

        var games_table = document.createElement('td');
        games_table.className = 'table_td';
        games_table.innerText = group_teams[j]['g']

        var wins_table = document.createElement('td');
        wins_table.className = 'table_td';
        wins_table.innerText = group_teams[j]['w']

        var draws_table = document.createElement('td');
        draws_table.className = 'table_td';
        draws_table.innerText = group_teams[j]['d']

        var losses_table = document.createElement('td');
        losses_table.className = 'table_td';
        losses_table.innerText = group_teams[j]['l']

        var goals_scored_table = document.createElement('td');
        goals_scored_table.className = 'table_td';
        goals_scored_table.innerText = group_teams[j]['gs']

        var goals_conceded_table = document.createElement('td');
        goals_conceded_table.className = 'table_td';
        goals_conceded_table.innerText = group_teams[j]['gc'];

        var goal_difference_table = document.createElement('td');
        goal_difference_table.className = 'table_td';
        goal_difference_table.innerText = group_teams[j]['gs'] - group_teams[j]['gc']

        var points_table = document.createElement('td');
        points_table.className = 'table_td';
        points_table.innerText = group_teams[j]['pts'];

        group_table_row.append(team_table);
        group_table_row.append(games_table);
        group_table_row.append(wins_table);
        group_table_row.append(draws_table);
        group_table_row.append(losses_table);
        group_table_row.append(goals_scored_table);
        group_table_row.append(goals_conceded_table);
        group_table_row.append(goal_difference_table);
        group_table_row.append(points_table);

        if (mode == 'predicted') {
            if (group_teams[j]['team'] == other_results[j]['team']) {
                group_table_row.style.backgroundColor = '#A6E22E';
                group_table_row.style.color = 'black';
            } else {
                group_table_row.style.backgroundColor = '#8B0000';
                group_table_row.style.color = 'white';
            }

        }

        table.appendChild(group_table_row);
    }
    return table

}