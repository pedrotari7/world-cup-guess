

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

    var rules_banner_nav = document.getElementById('rules_banner');
    rules_banner_nav.className = 'selected';

    var banner = document.getElementById('banner');

    banner.innerHTML += `
     <div style="width:88%; margin:6% 6% 6% 6%; color:white">
        <h3 style="text-align: center">
            The rules are simple!
        </h3>
        <h4 style="text-align: center">
            There is only one winner and all the other ones are nothing but losers.
        </h4>
        <h4>Points in each game</h4>
        <ul>
            <li style="color:black;background-color: #CAF2BF">Exact Score (right outcome of the game and exact number of goals scored by both teams) - 5 points</li>
            <li style="color:black;background-color: #C5E5E8">Right Result (right outcome of the game, but wrong number of goals of at least one of the teams) - 3 points</li>
            <li style="color:black;background-color: #F2EEC2">Right number of goals from one of the teams - 1 point</li>
            <li style="color:black;background-color: #F7DCDC">None of the above - 0 points</li>
            You are only awarded points once per game, so from the bullet points above you will receive the one that awards you the highest number of points. Each game will be colored with the respective point color.
        </ul>
        <h4>Groups</h4>
        <h4>You will be awarded 1 point per each succesfull guess on a team's final classification in the group stage.</h4>
        <h4>Final Stages</h4>
        <h5>In the final stages of the tournament each game is similar to the previous games, but in this case your prediction will be compared with the result at the end of the 90 or 120 minutes. Nonetheless in case of penalties if you guessed the team that is going through to the next stage, you will be awarded 1 extra point that adds to the ones that you might have acheived during the regular time.</h4>
        <h4>Individual Awards</h4>
        <ul>
            <li>Top Scorer - 5 points (if your chosen player is tied for most scored goals, the 5 points will still be awarded)</li>
            <li>Player of the tournament - 5 points</li>
        </ul>
        <br>
        <h4>Deadlines</h4>
        <ul>
            <li>In the group stages, the predictions have to be done in full before the start of the tournament.</li>
            <li>For the final stages games, the predictions will be available once the matchup is known, and have to be submited up to 1 hour before the game.</li>
            <li>The indivual awards predictions have to be subtimited before the start of the tournament.</li>
        </ul>
    </div>
    `







}