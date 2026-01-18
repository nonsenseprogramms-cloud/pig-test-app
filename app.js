let questions = [];
let testQuestions = [];
let currentIndex = 0;
let score = 0;
let selectedAnswer = null;

document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("startTestBtn").addEventListener("click", startTest);
    document.getElementById("nextBtn").addEventListener("click", nextQuestion);

    loadQuestions();
});

function loadQuestions() {
    fetch("questions.json")
        .then(res => res.json())
        .then(data => {
            questions = data;
        });
}

function startTest() {
    testQuestions = shuffleArray(questions).slice(0, 50);
    currentIndex = 0;
    score = 0;

    document.getElementById("startScreen").classList.add("hidden");
    document.getElementById("testScreen").classList.remove("hidden");

    showQuestion();
}

function showQuestion() {
    selectedAnswer = null;
    const q = testQuestions[currentIndex];

    document.getElementById("question").innerText =
        `${currentIndex + 1}. ${q.question}`;

    const answersDiv = document.getElementById("answers");
    answersDiv.innerHTML = "";

    q.answers.forEach((text, index) => {
        const div = document.createElement("div");
        div.className = "answer";
        div.innerText = text;

        div.addEventListener("click", () => selectAnswer(div, index));
        answersDiv.appendChild(div);
    });

    document.getElementById("score").innerText = `Баллы: ${score}`;
}

function selectAnswer(element, index) {
    if (selectedAnswer !== null) return;

    selectedAnswer = index;
    const q = testQuestions[currentIndex];

    const answers = document.querySelectorAll(".answer");

    answers[q.correct].classList.add("correct");

    if (index === q.correct) {
        score += 2;
    } else {
        element.classList.add("wrong");
    }
}

function nextQuestion() {
    if (selectedAnswer === null) return;

    currentIndex++;

    if (currentIndex >= testQuestions.length) {
        alert(`Тест завершён!\nБаллы: ${score}`);
        location.reload();
        return;
    }

    showQuestion();
}

function shuffleArray(array) {
    return array.sort(() => Math.random() - 0.5);
}