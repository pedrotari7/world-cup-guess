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
            game_div.className = 'game';

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

            var my_prediction = document.createElement('div');
            my_prediction.className = 'game';

            mine = game_info['predictions'][document.getElementById('user_name').innerHTML]

            var profile_picture = document.createElement('div');
            profile_picture.className = 'user_profile_picture';
            var profile_picture_img = document.createElement('img');
            profile_picture_img.className = 'user_profile_picture_img';
            profile_picture_img.src = mine['picture'];
            profile_picture.appendChild(profile_picture_img);

            var name_div = document.createElement('span');
            name_div.className = 'textBox name';
            name_div.innerText = document.getElementById('user_name').innerHTML;

            var score_div = document.createElement('span');
            score_div.className = 'textBox score';
            score_div.innerText = mine['prediction'][0] + ' - ' + mine['prediction'][1];


            my_prediction.appendChild(profile_picture);
            my_prediction.appendChild(name_div);
            my_prediction.appendChild(score_div);


            var others_predictions = document.createElement('div');
            others_predictions.className = 'others_predictions';


            for (var user in game_info['predictions']) {
                var game_div = document.createElement('div');
                game_div.className = 'game';

                var profile_picture = document.createElement('div');
                profile_picture.className = 'user_profile_picture';
                var profile_picture_img = document.createElement('img');
                profile_picture_img.className = 'user_profile_picture_img';
                profile_picture_img.src = game_info['predictions'][user]['picture'];
                profile_picture.appendChild(profile_picture_img);

                var name_div = document.createElement('span');
                name_div.className = 'textBox name';
                name_div.innerText = user;

                var score_div = document.createElement('span');
                score_div.className = 'textBox score';
                score_div.innerText = game_info['predictions'][user]['prediction'][0] + ' - ' + game_info['predictions'][user]['prediction'][1];

                game_div.appendChild(profile_picture);
                game_div.appendChild(name_div);
                game_div.appendChild(score_div);

                others_predictions.appendChild(game_div);
            }


            if (game_info.has_started) {

            } else {

            }

            document.getElementById('banner').appendChild(game_div);
            document.getElementById('banner').appendChild(my_prediction);
            document.getElementById('banner').appendChild(others_predictions);


        } else {
            console.error(info);
        }
    }
    xhr.send(null);
}