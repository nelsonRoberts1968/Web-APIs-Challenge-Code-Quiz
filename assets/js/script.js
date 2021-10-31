
//Reading qiestions ID tag
var questionsEl = document.querySelector("#questions");
//Reading the time count in milliseconds linking the time ID
var timerEl = document.querySelector("#time");
 //Start quiz button element lining it by its ID
 var startBtn = document.querySelector("#start-button");
//Submit buttom button by ID next to the initials
var submitBtn = document.querySelector("#submit-button");
var choicesEl = document.querySelector("#choices");
var initialsEl = document.querySelector("#initials-input");
var feedbackEl = document.querySelector("#feedback");

// Global variables for the Quiz Posisition of the question in an array

var currentQuestionIndex = 0;
var time = questions.length * 15;
var timerId;


//Start quiz function which will be envoked when start quiz button is clicked
function startQuiz() {
  // hide start screen
  var startScreenEl = document.getElementById("start-screen");
  startScreenEl.setAttribute("class", "hide");

  // show starting time
  timerEl.textContent = time;

  // un-hide questions section
  questionsEl.removeAttribute("class");

  // start timer in one second
  timerId = setInterval(clockTick, 1000);

  getQuestion();
}

function getQuestion() {
  // get current question object from array
  var currentQuestion = questions[currentQuestionIndex];

  // update title with current question
  var titleEl = document.getElementById("question-title");
  titleEl.textContent = currentQuestion.title;

  // clear out any old question choices
  choicesEl.innerHTML = "";

  // loop over choices
  currentQuestion.choices.forEach(function(choice, i) {
    // create new button for each choice
    var choiceNode = document.createElement("button");
    choiceNode.setAttribute("class", "choice");
    choiceNode.setAttribute("value", choice);

    choiceNode.textContent = i + 1 + ". " + choice;

    // attach click event listener to each choice
    choiceNode.onclick = questionClick;

    // display on the page
    choicesEl.appendChild(choiceNode);
  });
}

function saveScore() {
    // get value of input box
    var initials = initialsEl.value.trim();
  
    if (initials !== "") {
      // get saved scores from localstorage, or if not any, set to empty array
      //Assigned vallue of the highscore could be an empty Array
      var highscores =
        JSON.parse(window.localStorage.getItem("highscores")) || [];
  
      // format new score object for current user
      var newScore = {
        score: time,
        initials: initials
      };
  
      // save to localstorage
      //Bug here Doesnt seem to store values in Array..Have to pass a key and String value
      highscores.push(newScore);
      window.localStorage.setItem("highscores", JSON.stringify(highscores));
  
      // After saving route to the next html score page
      window.location.href = "score.html";
    }
  }

function questionClick() {
  // check if user guessed wrong
  if (this.value !== questions[currentQuestionIndex].answer) {
    // penalize time
    time -= 15;

    if (time < 0) {
      time = 0;
    }
    // display new time on page
    timerEl.textContent = time;
    feedbackEl.textContent = "Wrong Answer Try again!";
    feedbackEl.style.color = "red";
  } else {
    feedbackEl.textContent = "Correct!";
    feedbackEl.style.color = "green";
    feedbackEl.style.fontSize = "400%";
  }

  // flash right/wrong feedback
  feedbackEl.setAttribute("class", "feedback");
  setTimeout(function() {
    feedbackEl.setAttribute("class", "feedback hide");
  }, 1000);

  // next question
  currentQuestionIndex++;

  // time checker
  if (currentQuestionIndex === questions.length) {
    quizCompleted();
  } else {
    getQuestion();
  }
}

function quizCompleted() {
  // stop timer
  clearInterval(timerId);

  // show end screen
  var endScreenEl = document.getElementById("end-screen");
  endScreenEl.removeAttribute("class");

  // show final score
  var finalScoreEl = document.getElementById("final-score");
  finalScoreEl.textContent = time;

  // hide questions section
  questionsEl.setAttribute("class", "hide");
}

function clockTick() {
  // update time
  time--;
  timerEl.textContent = time;

  // check if user ran out of time
  if (time <= 0) {
    quizCompleted();
  }
}

function checkInitialValues(event) {
  if (event.key === "Enter") {
    saveScore();
  }
}

// submit initials
submitBtn.onclick = saveHighscore;

//Start Quiz function is envocked on button click
startBtn.onclick = startQuiz;

//User initials value assignment
initialsEl.onkeyup = checkInitialValues;