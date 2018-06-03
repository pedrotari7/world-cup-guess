function get_game(user_id, game_num) {
    document.title = "Game " + game_num;

    console.log('get_game',user_id,game_num);

    var url = "http://www.worldcupguess.win:5000/api/v1.0/game";

    var xhr = new XMLHttpRequest();

    xhr.open("GET", url+'/'+user_id+'/'+game_num, true);

    xhr.setRequestHeader('Content-type','application/json; charset=utf-8');

    var nav_elements = document.getElementsByClassName('selected');
    for (var i = 0; i < nav_elements.length; i++) {
        nav_elements[i].className = '';
    }

    xhr.onload = function () {
        var game_info = JSON.parse(xhr.responseText);
        if (xhr.readyState == 4 && xhr.status == "200") {
            console.log(game_info)

            var banner = document.getElementById('banner');

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

            var date_score_td = document.createElement('td');
            date_score_td.className = 'game_date_score';


            var date = new Date(game_info['info']['date']);
            date_score_td.innerText = date.getDate() + ' ' + monthNames[date.getMonth()] + ' @ ' + date.getHours();

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

            var away_team_td = document.createElement('td');
            away_team_td.className = 'game_team';
            away_team_td.innerText = game_info['info']['away_team'];

            game_row.appendChild(home_team_td);
            game_row.appendChild(home_team_flag_td);
            game_row.appendChild(date_score_td);
            game_row.appendChild(away_team_flag_td);
            game_row.appendChild(away_team_td);

            game_table.appendChild(game_row);

            var game_prediction_table = document.createElement('table');
            game_prediction_table.id = 'game_prediction_table';

            for (user in game_info['predictions']) {
                var user_row = document.createElement('tr');
                user_row.className = 'user_row';

                if (user == document.getElementById('user_name').innerHTML) {
                    user_row.style.backgroundColor = "#A6E22E";
                    user_row.style.color = "black";
                } else {
                    user_row.style.backgroundColor = "#474748";
                }

                var profile_picture = document.createElement('td');
                profile_picture.className = 'user_profile_picture';
                var profile_picture_img = document.createElement('img');
                profile_picture_img.className = 'user_profile_picture_img';
                profile_picture_img.src = game_info['predictions'][user].picture;
                profile_picture.appendChild(profile_picture_img);

                var name = document.createElement('td');
                name.className = 'user_name';
                name.innerText = user;

                var game_prediction_score = document.createElement('td');
                game_prediction_score.className = 'game_prediction_score';

                home_prediction = '';
                if (game_info['predictions'][user].hasOwnProperty('prediction') && game_info['predictions'][user].prediction.hasOwnProperty('home')) {
                    home_prediction = game_info['predictions'][user].prediction['home'];
                }
                away_prediction = '';
                if (game_info['predictions'][user].hasOwnProperty('prediction') && game_info['predictions'][user].prediction.hasOwnProperty('away')) {
                    away_prediction = game_info['predictions'][user].prediction['away'];
                }
                game_prediction_score.innerText = home_prediction + ' - ' + away_prediction;


                user_row.appendChild(profile_picture);
                user_row.appendChild(name);
                user_row.appendChild(game_prediction_score);

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