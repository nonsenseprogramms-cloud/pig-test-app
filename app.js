let questions = [];
let current = 0;
let score = 0;
let testQuestions = [];

const startBtn = document.getElementById("startBtn");
const testDiv = document.getElementById("test");
const questionDiv = document.getElementById("question");
const answersDiv = document.getElementById("answers");
const counterDiv = document.getElementById("counter");
const nextBtn = document.getElementById("nextBtn");

startBtn.addEventListener("click", startTest);
nextBtn.addEventListener("click", nextQuestion);

fetch("questions.json")
    .then(r => r.json())
    .then(data => {
        questions = data;
        console.log("Вопросы загружены:", questions.length);
    })
    .catch(e => alert("Ошибка загрузки questions.json"));

function startTest() {
    if (questions.length < 1) {
        alert("Вопросы не загружены");
        return;
    }

    startBtn.style.display = "none";
    testDiv.classList.remove("hidden");

    testQuestions = shuffle([...questions]).slice(0, 50);
    current = 0;
    score = 0;

    showQuestion();
}

function showQuestion() {
    const q = testQuestions[current];
    counterDiv.textContent = `Вопрос ${current + 1} / ${testQuestions.length} | Баллы: ${score}`;

    questionDiv.textContent = q.question;
    answersDiv.innerHTML = "";

    q.answers.forEach((a, i) => {
        const btn = document.createElement("button");
        btn.textContent = a;
        btn.className = "answer";
        btn.onclick = () => selectAnswer(i, q.correct);
        answersDiv.appendChild(btn);
    });
}

function selectAnswer(selected, correct) {
    const buttons = document.querySelectorAll(".answer");

    buttons.forEach((b, i) => {
        b.disabled = true;
        if (i === correct) b.classList.add("correct");
        if (i === selected && i !== correct) b.classList.add("wrong");
    });

    if (selected === correct) score += 2;
}

function nextQuestion() {
    current++;
    if (current >= testQuestions.length) {
        questionDiv.textContent = `Тест завершён. Баллы: ${score}`;
        answersDiv.innerHTML = "";
        nextBtn.style.display = "none";
    } else {
        showQuestion();
    }
}

function shuffle(arr) {
    return arr.sort(() => Math.random() - 0.5);
}