var width = 4;
var height = 3;
var colors = ['red', 'red', 'orange', 'orange', 'green', 'green', 'yellow', 'yellow', 'white', 'white', 'pink', 'pink'];
var excolor = colors.slice();
var color = [];
var clickflag = true;
var clickCard = [];
var completeCard = [];
var time_begin;

function shuffle() { // 피셔예이츠 셔플
  for (var i = 0; excolor.length > 0; i += 1) {
    color = color.concat(excolor.splice(Math.floor(Math.random() * excolor.length), 1));
  }
}

function settingCard(width, height) {
  clickflag = false;
  for (var i = 0; i < width * height; i += 1) {
    var card = document.createElement('div');
    card.className = 'card';
    var cardInner = document.createElement('div');
    cardInner.className = 'card-inner';
    var cardFront = document.createElement('div');
    cardFront.className = 'card-front';
    var cardBack = document.createElement('div');
    cardBack.className = 'card-back';
    cardBack.style.backgroundColor = color[i];
    cardInner.appendChild(cardFront);
    cardInner.appendChild(cardBack);
    card.appendChild(cardInner);
    (function (c) { 
      card.addEventListener('click', function() {
        if (clickflag && !completeCard.includes(c)) {
          c.classList.toggle('flipped');
          clickCard.push(c);
          if (clickCard.length === 2) { //카드를 두개 뽑았 을 때 
            if (clickCard[0].querySelector('.card-back').style.backgroundColor 
            === clickCard[1].querySelector('.card-back').style.backgroundColor) {
              completeCard.push(clickCard[0]);
              completeCard.push(clickCard[1]);
              clickCard = [];
              if (completeCard.length === 12) { //다 뒤집었을 때
                var time_end = new Date();
                var record = (time_end - time_begin) / 1000;
                alert(record + '초 걸렸습니다.');
                saveRecord(record);
                $("#endgame").show();
                document.querySelector('#wrapper').innerHTML = '';
                excolor = colors.slice();
                color = [];
                completeCard = [];
                time_begin = null;
              }
            } else { // 두 카드의 색깔이 다르면
              clickflag = false;
              setTimeout(function() {
                clickCard[0].classList.remove('flipped');
                clickCard[1].classList.remove('flipped');
                clickflag = true;
                clickCard = [];
              }, 1000);
            }
          }
        }
      });
    })(card);
    document.querySelector('#wrapper').appendChild(card);
  }

  document.querySelectorAll('.card').forEach(function (card, index) { // 초반 카드 공개
    setTimeout(function() {
      card.classList.add('flipped');
    }, 1000 + 100 * index);
  });

  setTimeout(function() { // 카드 감추기
    document.querySelectorAll('.card').forEach(function (card) {
      card.classList.remove('flipped');
    });
    clickflag = true;
    time_begin = new Date();
  }, 5000);
}


function retry() {
  shuffle();
  settingCard(width, height);
  $("#endgame").hide();
}


// Part of Parse
function logout() {
  Parse.User.logOut()
  .then((user) => {
    alert("GoodBye~!");
    window.location = "signin.html";
  });
}


function saveRecord(record) {
  var GameScore = Parse.Object.extend("GameScore");
  var gameScore = new GameScore();
  var query = new Parse.Query(GameScore);

  query.fullText("playerName", Parse.User.current().get("username"));

  query.find()
  .then(function(results) {
    if(results.length == 0) {
      gameScore.set("playerName", Parse.User.current().get("username"));
      gameScore.set("record", record);
      gameScore.save();
      alert("첫번째 판이시네요!");
    }
    else {
      var gamePlayer = results[0];
      if(gamePlayer.get("record") > record) {
        gamePlayer.set("record", record);
        gamePlayer.save();
        alert("신기록!");
      }
      else {
        alert("더 빨리 해보자")
      }
    }
  });
}

function showRanking() {
  window.location = "rank.html";
}