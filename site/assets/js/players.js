function get_players(user_id, team_name, mode) {
    document.title = team_name;

    var url = "http://www.worldcupguess.win:5000/api/v1.0/players";

    testConnection();

    var xhr = new XMLHttpRequest();

    xhr.open("GET", url + '/' + user_id + '/' + team_name, true);

    var nav_elements = document.getElementsByClassName('selected');
    for (var i = 0; i < nav_elements.length; i++) {
        nav_elements[i].className = '';
    }

    xhr.setRequestHeader('Content-type','application/json; charset=utf-8');

    xhr.onload = function () {
        var players = JSON.parse(xhr.responseText);
        if (xhr.readyState == 4 && xhr.status == "200") {
            var banner = document.getElementById('banner');

            banner.scrollTop = 0;

            while (banner.firstChild) {
                banner.removeChild(banner.firstChild);
            }

            var team_name_div = document.createElement('div');
            team_name_div.className = 'stage_div textBox';
            team_name_div.innerText = team_name;

            banner.appendChild(team_name_div);

            if (mode == 'mvp' || mode == 'top_scorer' || mode == 'golden_glove') {
                var mode_div = document.createElement('div');
                mode_div.className = 'stage_div textBox';
                if (mode == 'mvp') {
                    mode_div.innerText = 'Select the MVP...';
                } else if (mode == 'top_scorer') {
                    mode_div.innerText = 'Select the Top Scorer...';
                } else if (mode == 'golden_glove') {
                    mode_div.innerText = 'Select the Golden Glove...';
                }
                banner.appendChild(mode_div);
            }


            positions = [['GK', 'Goalkeepers'], ['DEF','Defenders'], ['MID','Midfielders'], ['FRW','Forwards']];

            for(var p in positions) {
                if (mode == 'golden_glove' && positions[p][0] != 'GK'){
                    continue;
                }

                position = positions[p][0];
                position_title = positions[p][1];

                var team_name_div = document.createElement('div');
                team_name_div.className = 'stage_div textBox';
                team_name_div.innerText = position_title;
                banner.appendChild(team_name_div);

                var players_container = document.createElement('div');
                players_container.className = 'players_container';

                for (var player in players[position]) {
                    var player_div = document.createElement('div');
                    player_div.className = 'players_div';

                    var player_image = document.createElement('img');
                    player_image.className = 'player_img';
                    player_image.src = players[position][player];

                    player_div.appendChild(player_image);


                    var player_name = document.createElement('p');
                    player_name.className = 'player_name';
                    player_name.innerText = player;


                    player_div.appendChild(player_name);

                    if (mode == 'mvp' || mode == 'top_scorer' || mode == 'golden_glove') {
                        var closureMaker = function(user_id, player_name) {
                            return function(){set_award(user_id, player_name, mode)};
                        }
                        var closure = closureMaker(user_id, player);
                        player_div.addEventListener('click', closure, false);
                    }

                    players_container.appendChild(player_div);

                }

                banner.appendChild(players_container);
            }
        } else {
            console.error(info);
        }
    }
    xhr.send(null);
}


function get_teams(user_id, mode) {
    document.title = "Countries";

    var url = "http://www.worldcupguess.win:5000/api/v1.0/teams";

    testConnection();

    var xhr = new XMLHttpRequest();

    xhr.open("GET", url + '/' + user_id , true);

    var nav_elements = document.getElementsByClassName('selected');
    for (var i = 0; i < nav_elements.length; i++) {
        nav_elements[i].className = '';
    }

    xhr.setRequestHeader('Content-type','application/json; charset=utf-8');

    xhr.onload = function () {
        var teams = JSON.parse(xhr.responseText);
        if (xhr.readyState == 4 && xhr.status == "200") {
            var banner = document.getElementById('banner');

            banner.scrollTop = 0;

            while (banner.firstChild) {
                banner.removeChild(banner.firstChild);
            }

            var header_div = document.createElement('div');
            header_div.className = 'stage_div textBox';
            header_div.innerText = 'Select the country...';

            banner.appendChild(header_div);

            var contries_container = document.createElement('div');
            contries_container.className = 'players_container';

            for (var team in teams) {
                var player_div = document.createElement('div');
                player_div.className = 'players_div';


                team_logo = JSON.parse(teams[team]);
                if ('src' in team_logo) {
                    var img = document.createElement("IMG")
                    img.className = 'country_img';
                    img.src = team_logo['src'].replace("23","60");;
                    player_div.appendChild(img);
                }

                var player_name = document.createElement('p');
                player_name.className = 'country_name';
                player_name.innerText = team;


                player_div.appendChild(player_name)

                var closureMaker = function(user_id, team_name, mode) {
                    return function(){get_players(user_id, team_name, mode)};
                }
                var closure = closureMaker(user_id, team, mode);
                player_div.addEventListener('click', closure, false);

                contries_container.appendChild(player_div);
            }

            banner.appendChild(contries_container);

        } else {
            console.error(info);
        }
    }
    xhr.send(null);
}


function set_award(user_id, player_name, mode) {
    document.title = "Countries";

    var url = "http://www.worldcupguess.win:5000/api/v1.0/awards";

    testConnection();

    var xhr = new XMLHttpRequest();

    xhr.open("GET", url + '/' + user_id + '/' + player_name + '/' + mode , true);

    var nav_elements = document.getElementsByClassName('selected');
    for (var i = 0; i < nav_elements.length; i++) {
        nav_elements[i].className = '';
    }

    xhr.setRequestHeader('Content-type','application/json; charset=utf-8');

    xhr.onload = function () {
        var teams = JSON.parse(xhr.responseText);
        if (xhr.readyState == 4 && xhr.status == "200") {
            get_my_predictions(user_id, document.getElementById('user_name').innerHTML);
        } else {
            console.error(info);
        }
    }
    xhr.send(null);
}