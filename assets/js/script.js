
//Reading questions ID tag
var questionsEl = document.querySelector("#questions");
//Reading the time count in milliseconds linking the time ID
var timerEl = document.querySelector("#time");
 //Start quiz button element lining it by its ID
 var startBtn = document.querySelector("#start-button");
//Submit buttom button by ID next to the initials
var submitBtn = document.querySelector("#submit-button");
var choicesEl = document.querySelector("#choices");
//Initials input field
var initialsEl = document.querySelector("#initials-input");
var responseEl = document.querySelector("#response");

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

  // show question selction after button click
  questionsEl.removeAttribute("class");

  // start timer after one Second..This is from the initial countdown logic
  timerId = setInterval(clockCountDown, 1000);

  getQuestion();
}

function getQuestion() {
  // get current question object from array
  var currentQuestion = questions[currentQuestionIndex];

  // update title with current question
  var titleEl = document.getElementById("question-title");
  titleEl.textContent = currentQuestion.title;

  // Set all aold choices back to an empty string
  choicesEl.innerHTML = "";

  // Look over available choices
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
    // Capture users iput initials
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
  // chec
  if (this.value !== questions[currentQuestionIndex].answer) {

    //adding 10 seconds everytime user gets a quastion wrong
    time -= 10;

    if (time < 0) {
      time = 0;
    }
    // display new time on page
    timerEl.textContent = time;
    responseEl.textContent = "Wrong Answer Try again!";
    responseEl.style.color = "red";
  } else {
    responseEl.textContent = "Correct!";
    responseEl.style.color = "green";
  }

  // flash right/wrong feedback
  responseEl.setAttribute("class", "response");
  setTimeout(function() {
    responseEl.setAttribute("class", "hide response");
  }, 1000);

  // Moves to the next question
  currentQuestionIndex++;

  // Check timer countdown
  if (currentQuestionIndex === questions.length) {
    quizCompleted();
  } else {
    getQuestion();
  }
}

function quizCompleted() {
  // stop countdown once quiz once completed
  clearInterval(timerId);

  // show end screen
  var endScreenEl = document.getElementById("end-screen");
  endScreenEl.removeAttribute("class");

  // show final score
  var finalScoreEl = document.getElementById("final-score");
  finalScoreEl.textContent = time;

  // Hide question options in the begining
  questionsEl.setAttribute("class", "hide");
}

function clockCountDown() {
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
//User initials value assignment
initialsEl.onkeyup = checkInitialValues;

startBtn.onclick = startQuiz;
// submit initials
document.getElementById("submit-button").addEventListener("click",function(){
    saveScore();
})
//Start Quiz function is envocked on button click
document.getElementById("start-button").addEventListener("click", function(){
    startQuiz();
})
