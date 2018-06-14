function get_leaderboard(user_id) {
    document.title = "Leaderboard";

    var url = "http://www.worldcupguess.win:5000/api/v1.0/leaderboard";

    testConnection();

    var xhr = new XMLHttpRequest();

    xhr.open("GET", url, true);

    var nav_elements = document.getElementsByClassName('selected');
    for (var i = 0; i < nav_elements.length; i++) {
        nav_elements[i].className = '';
    }

    user_name = document.getElementById('user');
    user_name.style.color = "white";

    var leaderboard_nav = document.getElementById('leaderboard');
    leaderboard.className = 'selected';

    xhr.setRequestHeader('Content-type','application/json; charset=utf-8');

    xhr.onload = function () {
        var leaderboard = JSON.parse(xhr.responseText);
        if (xhr.readyState == 4 && xhr.status == "200") {
            var banner = document.getElementById('banner');
            banner.scrollTop = 0;
            while (banner.firstChild) {
                banner.removeChild(banner.firstChild);
            }

            var table = document.createElement('table');
            table.id = 'leaderboard_table';

            var label_th = document.createElement('tr');
            label_th.className = 'label_th user_row';

            var pos_header = document.createElement('td');
            pos_header.className = 'user_pos';
            pos_header.innerHTML = '';
            var profile_picture_header = document.createElement('td');
            profile_picture_header.className = 'user_profile_picture';
            profile_picture_header.innerHTML = '';
            var name_header = document.createElement('td');
            name_header.className = 'user_name';
            name_header.innerHTML = '';
            var exact_score_header = document.createElement('td');
            exact_score_header.className = 'user_exact_score';
            exact_score_header.innerHTML = 'ES';
            var right_result_header = document.createElement('td');
            right_result_header.className = 'user_right_result';
            right_result_header.innerHTML = 'RR';
            var one_right_score_header = document.createElement('td');
            one_right_score_header.className = 'user_one_right_score';
            one_right_score_header.innerHTML = 'ORS';
            var fail_header = document.createElement('td');
            fail_header.className = 'user_fail';
            fail_header.innerHTML = 'F';
            var groups_header = document.createElement('td');
            groups_header.className = 'user_groups';
            groups_header.innerHTML = 'G';
            var penalties_header = document.createElement('td');
            penalties_header.className = 'user_penalties';
            penalties_header.innerHTML = 'P';
            var awards_header = document.createElement('td');
            awards_header.className = 'user_awards';
            awards_header.innerHTML = 'A';
            var points_header = document.createElement('td');
            points_header.className = 'user_points';
            points_header.innerHTML = 'PTS';

            label_th.appendChild(pos_header);
            label_th.appendChild(profile_picture_header);
            label_th.appendChild(name_header);
            label_th.appendChild(exact_score_header);
            label_th.appendChild(right_result_header);
            label_th.appendChild(one_right_score_header);
            label_th.appendChild(fail_header);
            label_th.appendChild(groups_header);
            label_th.appendChild(penalties_header);
            label_th.appendChild(awards_header);
            label_th.appendChild(points_header);

            table.appendChild(label_th);


            for (var i = 0; i < leaderboard.length; i++) {
                var user_row = document.createElement('tr');
                user_row.className = 'user_row';

                if (leaderboard[i].name == document.getElementById('user').innerHTML) {
                    user_row.style.backgroundColor = "#A6E22E";
                    user_row.style.color = "black";
                } else {
                    user_row.style.backgroundColor = "#474748";
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
                awards.innerText = leaderboard[i].results.player_top_scorer + leaderboard[i].results.player_mvp + leaderboard[i].results.player_golden_glove;

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

                var closureMaker = function(a, b) {
                    return function(){get_my_predictions(a, b);};
                }
                var closure = closureMaker(user_id, leaderboard[i].name);
                user_row.addEventListener('click', closure, false);

                table.appendChild(user_row);
            }

            banner.appendChild(table);

            var labels = document.createElement('div');

            header_text = ['ES - Exact Score','RR - Right Result','ORS - One Right Result', 'F - Fail', 'G - Groups', 'P - Penalties', 'A - Awards', 'PTS - Points'];

            for (var i = 0; i < header_text.length; i++) {
                var text = document.createElement('p');
                text.className = 'header_label';
                text.innerText = header_text[i];
                labels.appendChild(text);
            }

            banner.appendChild(labels);

        } else {
            console.error(info);
        }
    }
    xhr.send(null);
}