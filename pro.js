
const answers = {

    library: {
        title: "Library Information",

        answer: "The ULK library provides study spaces, books, research materials and learning resources. Please contact the library desk for today's opening hours."
    },

    timetable: {
        title: "Timetable",

        answer: "You can check your class timetable through your department or student portal. Choose your programme and academic year to view your schedule."
    },

    student: {
        title: "Student Services",

        answer: "Student services can assist with registration, student identification, fees guidance and general student enquiries."
    },

    academic: {
        title: "Academic Affairs",

        answer: "The Academic Affairs office provides information about examinations, results, course registration and academic records."
    },

    support: {
        title: "Student Support",

        answer: "For student support, visit the student affairs office or contact the university help desk."
    },

    about: {
        title: "About ULK",

        answer: "Kigali Independent University, known as ULK, is a higher-learning institution in Rwanda."
    }

};

// DISPLAY ANSWERS

function showAnswer(topic, queryText) {

    const item = answers[topic] || answers.about;

    document.getElementById("heardText").textContent =
        "${queryText || item.title}";

    document.getElementById("answerText").textContent =
        item.answer;

    document.getElementById("listeningText").textContent =
        "Response ready";

    document.getElementById("micCaption").textContent =
        "Click to Speak";

    document.querySelector(".listening-box").classList.remove("active");

    document.getElementById("micButton").classList.remove("listening");

    addRecent(queryText || item.title);

}


// IDENTIFY USER QUESTIONS

function findTopic(text) {

    const q = text.toLowerCase();

    if (q.includes("library") || q.includes("book") ||
        q.includes("opening hour")) {
        return "library";
    }

    if (q.includes("timetable") || q.includes("schedule") ||
        q.includes("this week")) {
        return "timetable";
    }

    if (q.includes("registration") || q.includes("student")) {
        return "student";
    }

    if (q.includes("academic") || q.includes("exam") ||
        q.includes("result")) {
        return "academic";
    }

    if (q.includes("support") || q.includes("help")) {
        return "support";
    }

    if (q.includes("about") || q.includes("ulk") ||
        q.includes("university")) {
        return "about";
    }

    return "about";

}


// RECENT QUERIES

function addRecent(text) {

    const list = document.getElementById("recentList");

    const li = document.createElement("li");

    const dot = document.createElement("span");

    const label = document.createTextNode(text);

    const time = document.createElement("small");

    time.textContent = "just now";

    li.append(dot, label, time);

    list.prepend(li);

    while (list.children.length > 4) {
        list.lastElementChild.remove();
    }

}


// QUICK SERVICE BUTTONS

document.querySelectorAll("[data-topic]").forEach(button => {

    button.addEventListener("click", () => {

        showAnswer(
            button.dataset.topic,
            answers[button.dataset.topic].title
        );

    });

});


// SIDEBAR BUTTONS

document.querySelectorAll(".side-link").forEach(button => {

    button.addEventListener("click", () => {

        document.querySelectorAll(".side-link").forEach(link => {
            link.classList.remove("selected");
        });

        button.classList.add("selected");

        const section = button.dataset.section;

        if (answers[section]) {
            showAnswer(section, button.textContent.trim());
        }

    });

});


// VOICE RECOGNITION

const SpeechRecognition =
    window.SpeechRecognition ||
    window.webkitSpeechRecognition;


if (SpeechRecognition) {

    const recognition = new SpeechRecognition();

    recognition.lang = "en-US";

    recognition.interimResults = false;

    recognition.maxAlternatives = 1;


    document.getElementById("micButton").addEventListener("click", () => {

        try {

            recognition.start();

            document.getElementById("micButton")
                .classList.add("listening");

            document.getElementById("micCaption")
                .textContent = "Listening...";

            document.getElementById("listeningText")
                .textContent = "Listening...";

            document.querySelector(".listening-box")
                .classList.add("active");

        } catch (error) {

            document.getElementById("listeningText")
                .textContent = "Please wait...";

        }

    });


    recognition.onresult = function(event) {

        const transcript =
            event.results[0][0].transcript;

        const topic = findTopic(transcript);

        showAnswer(topic, transcript);

    };


    recognition.onerror = function(event) {

        document.getElementById("listeningText")
            .textContent = "Voice not recognised. Use keyboard instead.";

        document.getElementById("micButton")
            .classList.remove("listening");

    };


    recognition.onend = function() {

        document.getElementById("micButton")
            .classList.remove("listening");

        document.querySelector(".listening-box")
            .classList.remove("active");

    };

}



// KEYBOARD ASSISTANT

const modal = document.getElementById("keyboardModal");

document.getElementById("keyboardButton")
    .addEventListener("click", () => {

        modal.classList.add("open");

        document.getElementById("questionInput").focus();

    });


// CLOSE MODAL

document.getElementById("closeModal")
    .addEventListener("click", () => {

        modal.classList.remove("open");

    });


// SUBMIT QUESTIONS

document.getElementById("questionForm")
    .addEventListener("submit", function(event) {

        event.preventDefault();

        const question =
            document.getElementById("questionInput").value.trim();

        if (!question) return;

        const topic = findTopic(question);

        const item = answers[topic];

        const output = document.getElementById("typedAnswer");

        output.innerHTML =
            `<strong>${item.title}</strong><br>${item.answer}`;

        showAnswer(topic, question);

    });


// MOBILE MENU

document.querySelector(".menu-toggle")?.addEventListener("click", () => {

    document.querySelector(".sidebar")
        .scrollIntoView({ behavior: "smooth" });

});