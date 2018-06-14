

function get_rules() {
    document.title = "Rules";

    var banner = document.getElementById('banner');

    while (banner.firstChild) {
        banner.removeChild(banner.firstChild);
    }

    var nav_elements = document.getElementsByClassName('selected');
    for (var i = 0; i < nav_elements.length; i++) {
        nav_elements[i].className = '';
    }

    user_name = document.getElementById('user');
    user_name.style.color = "white";

    banner.scrollTop = 0;

    var rules_banner_nav = document.getElementById('rules_banner');
    rules_banner_nav.className = 'selected';

    var banner = document.getElementById('banner');

    banner.innerHTML += `
     <div style="width:96%; margin:2% 2% 2% 2%; color:white">
        <div class="stage_div textBox" style="color:#A6E22E;">
            The rules are simple!
        </div>

        <div class="stage_div textBox">
            There is only one winner and everyone else is nothing but a loser.
        </div>

        <div class="stage_div textBox"> </div>

        <div class="stage_div textBox">
            Points in each game:
        </div>
        <div class="stage_div textBox" style="color:black;background-color: #A6E22E">Exact Score (right outcome of the game and exact number of goals scored by both teams) - 5 points</div>
        <div class="stage_div textBox" style="color:black;background-color: #66D9EF">Right Result (right outcome of the game, but wrong number of goals of at least one of the teams) - 3 points</div>
        <div class="stage_div textBox" style="color:black;background-color: #E6DB74">Right number of goals from one of the teams - 1 point</div>
        <div class="stage_div textBox" style="color:white;background-color: #8B0000">None of the above - 0 points</div>

        <div class="stage_div textBox">
            You are only awarded points once per game, so from the bullet points above you will receive the one that awards you the highest number of points. Each game will be colored with the respective point color.
        </div>

        <div class="stage_div textBox"> </div>

        <div class="stage_div textBox" style="color:#A6E22E;">
            Groups
        </div>
        <div class="stage_div textBox" style="color:black;background-color: #E6DB74">
            You will be awarded 1 point per each succesful guess on a team's final position in the group stage.
        </div>

        <div class="stage_div textBox"> </div>

        <div class="stage_div textBox" style="color:#A6E22E;">
            Final Stages
        </div>

        <div class="stage_div textBox">
            In the final stages of the tournament each game is similar to the group stage games, but in this case your prediction will be compared with the result at the end of the 90 or 120 minutes.
            Nonetheless, in case of penalty shootout if you guessed correctly the team ends up going through to the next stage,
            you will be awarded 1 extra point that adds to the ones that you might have acheived during the regular time.

        </div>

        <div class="stage_div textBox"> </div>

        <div class="stage_div textBox" style="color:#A6E22E;">
            Individual Awards
        </div>

        <div class="stage_div textBox" style="color:black;background-color: #A6E22E">
            Top Scorer - 5 points </br>
            Player of the tournament - 5 points </br>
            Golden Glove - 5 points </br>
        </div>

        <div class="stage_div textBox"> </div>

        <div class="stage_div textBox" style="color:#A6E22E;">
            Deadlines
        </div>

        <div class="stage_div textBox">
            In the group stages the predictions for each game have to be done before the its start.</br>
            For the final stages games, the predictions will be available once the matchup is known and have to be submited before the game starts.</br>
            The indivual awards predictions have to be subtimited before the start of the tournament (start of the first game).</br>
        </div>
    </div>
    `







}