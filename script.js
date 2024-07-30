var form = document.getElementById('assessment-form');
var resultsDiv = document.getElementById('results');
var geniusesP = document.getElementById('geniuses');
var frustrationsP = document.getElementById('frustrations');
var competenciesP = document.getElementById('competencies');

var correlations = {
    1: "Wonder",
    2: "Invention",
    3: "Discernment",
    4: "Galvanizing",
    5: "Enablement",
    6: "Tenacity"
};

var questions = {
    1: [1, 7, 12, 21, 26],
    2: [2, 8, 15, 19, 29],
    3: [3, 9, 16, 20, 23, 30],
    4: [4, 10, 17, 24, 22],
    5: [5, 11, 18, 25],
    6: [6, 13, 27, 28, 14]
};

var oppositeGenius = {
    "Wonder": "Tenacity",
    "Invention": "Enablement",
    "Discernment": "Galvanizing",
    "Galvanizing": "Discernment",
    "Enablement": "Invention",
    "Tenacity": "Wonder"
};

document.addEventListener('DOMContentLoaded', function (event) {
    loadResponsesFromCookies();
});

form.addEventListener('change', function (event) {
    if (event.target.type === 'radio') {
        setCookie(event.target.name, event.target.value, 7);
    }
});

form.addEventListener('submit', function (event) {
    event.preventDefault();

    var formData = new FormData(form);
    var scores = {
        "Wonder": 0,
        "Invention": 0,
        "Discernment": 0,
        "Galvanizing": 0,
        "Enablement": 0,
        "Tenacity": 0
    };

    formData.forEach(function (value, key) {
        var questionNumber = parseInt(key.substring(1));
        var geniusType = getGeniusType(questionNumber);
        scores[geniusType] += parseInt(value);
    });

    displayResults(scores);
});

function getGeniusType(questionNumber) {
    for (var genius in questions) {
        if (questions[genius].indexOf(questionNumber) !== -1) {
            return correlations[genius];
        }
    }
}

function displayResults(scores) {
    var sortedScores = Object.entries(scores).sort(function (a, b) { return b[1] - a[1]; });
    var geniuses = sortedScores.slice(0, 2).map(function (entry) { return entry[0]; });
    var frustrations = sortedScores.slice(-2).map(function (entry) { return entry[0]; });
    var competencies = frustrations.map(function (frustration) { return oppositeGenius[frustration]; });

    geniusesP.textContent = 'Geniuses: ' + geniuses.join(', ');
    frustrationsP.textContent = 'Frustrations: ' + frustrations.filter(function (f) { return f; }).join(', ');
    competenciesP.textContent = 'Competencies: ' + competencies.filter(function (c) { return c; }).join(', ');

    resultsDiv.classList.remove('hidden');
}

function setCookie(name, value, days) {
    var d = new Date();
    d.setTime(d.getTime() + (days * 24 * 60 * 60 * 1000));
    var expires = "expires=" + d.toUTCString();
    document.cookie = name + "=" + value + ";" + expires + ";path=/";
}

function getCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) === ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}

function loadResponsesFromCookies() {
    var inputs = document.querySelectorAll('input[type="radio"]');
    inputs.forEach(function (input) {
        var value = getCookie(input.name);
        if (value && input.value === value) {
            input.checked = true;
        }
    });
}
