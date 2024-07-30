const form = document.getElementById('assessment-form');
const resultsDiv = document.getElementById('results');
const geniusesP = document.getElementById('geniuses');
const frustrationsP = document.getElementById('frustrations');
const competenciesP = document.getElementById('competencies');

const correlations = {
    1: "Wonder/Invention",
    2: "Galvanization",
    3: "Optimization",
    4: "Discernment",
    5: "Execution",
    6: "Enablement"
};

const questions = {
    1: [1, 7, 12, 21, 26],
    2: [2, 8, 15, 19, 29],
    3: [3, 9, 16, 20, 23],
    4: [4, 10, 17, 24],
    5: [5, 11, 18, 25],
    6: [6, 13, 27]
};

const oppositeGenius = {
    "Wonder/Invention": "Execution",
    "Galvanization": "Discernment",
    "Optimization": "Enablement",
    "Discernment": "Galvanization",
    "Execution": "Wonder/Invention",
    "Enablement": "Optimization"
};

form.addEventListener('submit', function (event) {
    event.preventDefault();

    const formData = new FormData(form);
    const scores = {
        "Wonder/Invention": 0,
        "Galvanization": 0,
        "Optimization": 0,
        "Discernment": 0,
        "Execution": 0,
        "Enablement": 0
    };

    for (let [key, value] of formData.entries()) {
        const questionNumber = parseInt(key.substring(1));
        const geniusType = getGeniusType(questionNumber);
        scores[geniusType] += parseInt(value);
    }

    displayResults(scores);
});

function getGeniusType(questionNumber) {
    for (let genius in questions) {
        if (questions[genius].includes(questionNumber)) {
            return correlations[genius];
        }
    }
}

function displayResults(scores) {
    const sortedScores = Object.entries(scores).sort((a, b) => b[1] - a[1]);
    const geniuses = sortedScores.slice(0, 2).map(entry => entry[0]);
    const frustrations = sortedScores.slice(-2).map(entry => entry[0]);
    const competencies = frustrations.map(frustration => oppositeGenius[frustration]);

    geniusesP.textContent = `Geniuses: ${geniuses.join(', ')}`;
    frustrationsP.textContent = `Frustrations: ${frustrations.join(', ')}`;
    competenciesP.textContent = `Competencies: ${competencies.join(', ')}`;

    resultsDiv.classList.remove('hidden');
}
