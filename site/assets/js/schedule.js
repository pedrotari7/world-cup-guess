function get_schedule(user_id, group_filter) {
    document.title = "Schedule";

    var url = "http://www.worldcupguess.win:5000/api/v1.0/schedule";

    var xhr = new XMLHttpRequest();

    xhr.open("GET", url, true);

    xhr.setRequestHeader('Content-type','application/json; charset=utf-8');

    var nav_elements = document.getElementsByClassName('selected');
    for (var i = 0; i < nav_elements.length; i++) {
        nav_elements[i].className = '';
    }

    var schedule_nav = document.getElementById('schedule');
    schedule.className = 'selected';

    xhr.onload = function () {
        var banner = document.getElementById('banner');
        banner.scrollTop = 0;
        var info = JSON.parse(xhr.responseText);
        if (xhr.readyState == 4 && xhr.status == "200") {
            previous_stage = "";
            games_order = info['games_order'];
            games = info['games_info']['games'];
            teams = info['games_info']['teams'];

            console.log(games_order);

            while (banner.firstChild) {
                banner.removeChild(banner.firstChild);
            }

            for (var k = 0; k < games_order.length; k++) {
                g = games_order[k];

                if (games[g]['stage'] != previous_stage) {

                    if (schedule_table) {
                        banner.appendChild(schedule_table);
                    }
                    var stage_div = document.createElement('div');
                    stage_div.className = 'stage_div textBox';
                    stage_div.innerText = games[g]['stage'];
                    banner.appendChild(stage_div);
                    previous_stage = games[g]['stage'];

                    if(games[g]['stage'] == 'Groups Stage') {

                        var groups_div = document.createElement('div');
                        groups_div.className = 'groups';

                        var groups = ['A','B','C','D','E','F','G','H'];

                        for (var i = 0; i < groups.length; i++) {

                            var group_link = document.createElement('div');

                            var closureMaker = function(a, b) {
                                return function(){get_schedule(a, b);};
                            }

                            var closure = closureMaker(user_id, groups[i]);

                            group_link.addEventListener('click', closure, false);

                            group_link.className = 'group group_' + groups[i];

                            var group = document.createElement('div');
                            group.className = 'textBox group_link';
                            group.innerText = groups[i];
                            group_link.appendChild(group);
                            groups_div.appendChild(group_link);
                        }

                        banner.appendChild(groups_div);
                    }

                    var schedule_table = document.createElement('table');
                    schedule_table.className = 'game_table';
                }

                if (typeof group_filter !== "undefined") {
                    if (!(games[g]['home_team'] in teams && group_filter == teams[games[g]['home_team']]['groups'])) {
                        continue;
                    }
                }

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

                var date_score_td = document.createElement('td');
                date_score_td.className = 'game_date_score';

                var date = new Date(games[g]['date']);
                date_score_td.innerText = date.getDate() + ' ' + monthNames[date.getMonth()] + ' @ ' + date.getHours();

                var away_team_flag_td = document.createElement('td');
                away_team_flag_td.className = 'team_flag';
                if (games[g]['away_team'] in teams) {
                    team_logo = JSON.parse(teams[games[g]['away_team']]['logo']);
                    if ('src' in team_logo) {
                        var away_img = document.createElement("IMG")
                        away_img.className = 'team_flag_img';
                        away_img.src = team_logo['src'].replace("23","60");
                        away_team_flag_td.appendChild(away_img);
                    }
                }

                var away_team_td = document.createElement('td');
                away_team_td.className = 'game_team';
                away_team_td.innerText = games[g]['away_team'];


                schedule_row.appendChild(game_number_td);
                schedule_row.appendChild(home_team_td);
                schedule_row.appendChild(home_team_flag_td);
                schedule_row.appendChild(date_score_td);
                schedule_row.appendChild(away_team_flag_td);
                schedule_row.appendChild(away_team_td);

                schedule_table.appendChild(schedule_row);
            }

            banner.appendChild(schedule_table);

        } else {
            console.error(info);
        }
    }
    xhr.send(null);
}