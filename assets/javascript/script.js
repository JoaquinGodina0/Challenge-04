//variables that include the questions, a timer, choices, a submit button, a start button,
var startScreenEl = document.querySelector("#start-screen");
var endScreenEl = document.querySelector("#end-screen");
var scoreScreenEl = document.querySelector("#highscore-screen");
var questionsEl = document.querySelector("#questions");
var timerEl = document.querySelector("#time");
var choicesEl = document.querySelector("#choices");
var submitBtn = document.querySelector("#submit");
var startBtn = document.querySelector("#start");
var highscoresBtnEl = document.querySelector("#scores-button");
var initialsEl = document.querySelector("#initials");
var answerWorCEl = document.querySelector("#answerWorC");

//makes an array of the question, choices, and the answer
var questions = [
    {
      title: "The condition in an if/else statement is enclosed with _______.",
      choices: ["quotes", "curly brackets", "parenthesis", "square brackets"],
      answer: "curly brackets"
    },
    {
      title: "Commonly used data types DO Not Include:",
      choices: ["string", "boolean", "alerts", "numbers"],
      answer: "alerts"
    },
    {
      title: "A very useful tool used during development and debugging for printing content to the debugger is:",
      choices: ["Javascript", "terminal/bash", "for loops", "console.log"],
      answer: "console.log"
    },
    {
      title: "String values must be enclosed within _____ when being assigned to variables.",
      choices: ["commas", "curly brackets", "quotes", "parenthesis"],
      answer: "quotes"
    },
    {
      title: "Arrays in javascript can be used to store __________.",
      choices: ["numbers and strings", "other arrays", "booleans", "all of the above"],
      answer: "all of the above"
    },
  ];

//updates the question number and timer as the user answers
var currentQuestionIndex = 0;
var time = questions.length * 15;
var timerId;

//function made to hide the start screen in order to get to the questions
function startQuiz() {
  startScreenEl.setAttribute("class", "hide");
  //Makes the question visible after pressing start button
  questionsEl.removeAttribute("class");
  //start timer
  timerId = setInterval(clockTick, 1000);
  //shows the timer
  timerEl.textContent = time;

  getQuestion();
}

//function in order to get to the next question
function getQuestion() {
  var currentQuestion = questions[currentQuestionIndex];
  //updates the title to the next question
  var titleEl = document.getElementById("question");
  titleEl.textContent = currentQuestion.title;
  //clears all choices from past question
  choicesEl.innerHTML = "";
  //makes a loop to grab each choice and make a button for it
  currentQuestion.choices.forEach(function(choice, choiceNumber) {
    //makes a new button for each choice
    var choiceNode = document.createElement("button");
    choiceNode.setAttribute("class", "choice");
    choiceNode.setAttribute("value", choice);
    choiceNode.textContent = choiceNumber + 1 + ". " + choice;
    //attach click event listener to each choice
    choiceNode.onclick = questionClick;
    //display on the page
    choicesEl.appendChild(choiceNode);
  });
}

//function that displays to the user whether they got the answer right or wrong and allows them to move to the next questions
function questionClick() {
  //checks to see if the user got the wrong answer
  if (this.value !== questions[currentQuestionIndex].answer) {
    //removes time if answer was wrong
    time -= 20;

    if (time < 0) {
      time = 0;
    }
    //updates to new time
    timerEl.textContent = time;
    answerWorCEl.textContent = "Wrong!";
    answerWorCEl.style.color = "light grey";
    answerWorCEl.style.fontSize = "200%";
  } else {
    answerWorCEl.textContent = "Correct!";
    answerWorCEl.style.color = "light grey";
    answerWorCEl.style.fontSize = "200%";
  }

  //tell the user if their answer was wrong or correct
  answerWorCEl.setAttribute("class", "answerWorCEl");
  setTimeout(function() {
    answerWorCEl.setAttribute("class", "answerWorCEl hide");
  }, 1000);

  //gos to the next question
  currentQuestionIndex++;

  //checks time
  if (currentQuestionIndex === questions.length) {
    quizEnd();
  } else {
    getQuestion();
  }
}

//function that displays the final score and shows end screen
function quizEnd() {
  //stops the timer
  clearInterval(timerId);
  //shows the end screen in order to enter initials
  endScreenEl.removeAttribute("class");
  //shows the final score
  var finalScoreEl = document.getElementById("final-score");
  finalScoreEl.textContent = time;
  //prevents the questions from showing
  questionsEl.setAttribute("class", "hide");
}

//function that constantly updates time whether the user gets the answer wrong or time is wasted on a question
function clockTick() {
  //updates time
  time--;
  timerEl.textContent = time;
  //checks to see if the user ran out of time
  if (time <= 0) {
    quizEnd();
  }
}

//function that allows user to save scores to local storage
function saveScore() {
  //gets whatever the user put in the box
  var initials = initialsEl.value.trim();
  if (initials !== "") {
    //set array to empty if no scores were found
    var scores =
      JSON.parse(window.localStorage.getItem("scores")) || [];

    // format new score object for current user
    var newScore = {
      score: time,
      initials: initials
    };

    //saves score to local storage
    scores.push(newScore);
    window.localStorage.setItem("scores", JSON.stringify(scores));

    showScores();
  }
}

//allows user to enter initials and save highscore
function checkForEnter(event) {
    if (event.key === "Enter") {
      saveScore();
    }
  }

//saves highscore once submit button is clicked
submitBtn.onclick = saveScore;
//starts quiz once the start button is clicked
startBtn.onclick = startQuiz;
//shows scores on click
highscoresBtnEl.onclick = showScores;
//submits score on clicking submit button
initialsEl.onkeyup = checkForEnter;


//function that shows the scores on clicking the highscore button
function showScores() {
    endScreenEl.setAttribute("class", "hide");
    startScreenEl.setAttribute("class", "hide");
    scoreScreenEl.removeAttribute("class", "hide");
    highscoresBtnEl.setAttribute("class","hide");

    printScores();
}
//function that shows scores on click
function printScores() {
    //saves old score by pulling from local storage and leaves empty if a score wasn't saved
    var scores = JSON.parse(window.localStorage.getItem("scores")) || [];
    //sorts the highscore by the highest to lowest
    scores.sort(function(a, b) {
      return b.score - a.score;
    });
    
    scores.forEach(function(score) {
      //puts each highscore in a list
      var liTag = document.createElement("li");
      liTag.textContent = score.initials + " - " + score.score;
      var olEl = document.getElementById("scores");
      olEl.appendChild(liTag);
    });
  }
  
  //function that clears scores on clicking clear button
  function clearScores() {
    window.localStorage.removeItem("scores");
    window.location.reload();
  }

  //function to give the goBack button functionalitly
  function goBack(){
    window.location.reload();
  }
  
  document.getElementById("goBack").onclick = goBack;
  document.getElementById("clear").onclick = clearScores;
  