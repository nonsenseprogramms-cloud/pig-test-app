let questions = [];
let testQuestions = [];
let currentIndex = 0;
let score = 0;
let selected = null;

// элементы
const startBtn = document.getElementById("startBtn");
const testDiv = document.getElementById("test");
const questionDiv = document.getElementById("question");
const answersDiv = document.getElementById("answers");
const nextBtn = document.getElementById("nextBtn");
const resultDiv = document.getElementById("result");
const progressDiv = document.getElementById("progress");

const tabTest = document.getElementById("tabTest");
const tabList = document.getElementById("tabList");
const testTab = document.getElementById("testTab");
const listTab = document.getElementById("listTab");

const searchInput = document.getElementById("search");
const questionsList = document.getElementById("questionsList");

// загрузка вопросов
fetch("questions.json")
    .then(r => r.json())
    .then(data => {
        questions = data;
        renderQuestionsList();
    });

// вкладки
tabTest.onclick = () => {
    tabTest.classList.add("active");
    tabList.classList.remove("active");
    testTab.classList.remove("hidden");
    listTab.classList.add("hidden");
};

tabList.onclick = () => {
    tabList.classList.add("active");
    tabTest.classList.remove("active");
    listTab.classList.remove("hidden");
    testTab.classList.add("hidden");
};

// ---- ТЕСТ ----
startBtn.onclick = startTest;
nextBtn.onclick = nextQuestion;

function startTest() {
    testQuestions = shuffle([...questions]).slice(0, 50);
    currentIndex = 0;
    score = 0;

    startBtn.classList.add("hidden");
    resultDiv.classList.add("hidden");
    testDiv.classList.remove("hidden");

    showQuestion();
}

function showQuestion() {
    selected = null;
    answersDiv.innerHTML = "";

    let q = testQuestions[currentIndex];
    progressDiv.textContent = `Вопрос ${currentIndex + 1} из ${testQuestions.length}`;
    questionDiv.textContent = q.question;

    q.options.forEach((opt, i) => {
        let div = document.createElement("div");
        div.className = "answer";
        div.textContent = opt;
        div.onclick = () => selectAnswer(div, i, q.correct);
        answersDiv.appendChild(div);
    });
}

function selectAnswer(div, index, correct) {
    if (selected !== null) return;
    selected = index;

    document.querySelectorAll(".answer").forEach((el, i) => {
        if (i === correct) el.classList.add("correct");
        if (i === index && i !== correct) el.classList.add("wrong");
    });

    if (index === correct) score += 2;
}

function nextQuestion() {
    if (selected === null) return;

    currentIndex++;
    if (currentIndex >= testQuestions.length) {
        finishTest();
    } else {
        showQuestion();
    }
}

function finishTest() {
    testDiv.classList.add("hidden");
    resultDiv.classList.remove("hidden");
    resultDiv.innerHTML = `
        <h2>Результат</h2>
        <p>Баллы: <b>${score}</b></p>
        <button onclick="location.reload()">Пройти снова</button>
    `;
}

// ---- СПИСОК ВОПРОСОВ ----
function renderQuestionsList(filter = "") {
    questionsList.innerHTML = "";

    questions
        .filter(q => q.question.toLowerCase().includes(filter))
        .forEach(q => {
            let div = document.createElement("div");
            div.className = "question-card";

            let html = `<div>${q.question}</div><ul>`;
            q.options.forEach((opt, i) => {
                if (i === q.correct) {
                    html += `<li class="correct-answer">${opt}</li>`;
                } else {
                    html += `<li>${opt}</li>`;
                }
            });
            html += "</ul>";

            div.innerHTML = html;
            questionsList.appendChild(div);
        });
}

searchInput.oninput = e => {
    renderQuestionsList(e.target.value.toLowerCase());
};

// утилита
function shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}