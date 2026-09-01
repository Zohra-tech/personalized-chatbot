let nameDatabase = [];
const nameInput = document.getElementById("userInputName");
const sendNameButton = document.getElementById("sendNameButton");
const nameInputSection = document.getElementById("nameInputSection");
const nameResponse = document.getElementById("nameResponse");
const nameGreeting = document.getElementById("nameGreeting");
const nameMeaning = document.getElementById("nameMeaning");
const funFactSection = document.getElementById("funFactSection");
const funFact = document.getElementById("funFact");
const nameNotFoundSection = document.getElementById("nameNotFoundSection");
const retryButton = document.getElementById("retryButton");
const yesButton = document.getElementById("yesButton");
const noButton = document.getElementById("noButton");
const feedbackResponse = document.getElementById("feedbackResponse");
const feedbackMessage = document.getElementById("feedbackMessage");
const feedbackRetryButton = document.getElementById("feedbackRetryButton");

console.log("NameWise JavaScript started!");
console.log("Name input:", nameInput);
console.log("Submit button:", sendNameButton);

fetch("./names.csv")
    .then(response => {
        console.log("CSV response:", response.status);
        if (!response.ok) {
            throw new Error(
                "Could not load names.csv"
            );
        }

        return response.text();

    })

    .then(data => {

        console.log("✅ names.csv loaded");

        nameDatabase = parseCSV(data);

        console.log(
            "✅ Database loaded:",
            nameDatabase.length,
            "names"
        );

        console.log(nameDatabase);

    })

    .catch(error => {

        console.error(
            "❌ Database error:",
            error
        );

    });

function parseCSV(data) {

    const lines = data
        .trim()
        .split(/\r?\n/);

    // Remove header
    lines.shift();

    const database = [];

    lines.forEach(line => {

        // Split first 3 commas only
        const parts = line.split(",");

        if (parts.length >= 4) {

            const name = parts[0].trim();
            const origin = parts[1].trim();
            const meaning = parts[2].trim();

            // Everything after the third comma
            // belongs to the fun fact
            const funFact = parts
                .slice(3)
                .join(",")
                .trim();

            database.push({

                name: name,

                origin: origin,

                meaning: meaning,

                funFact: funFact

            });

        }

    });

    return database;
}

if (sendNameButton) {

    sendNameButton.addEventListener(
        "click",
        checkName
    );

}

if (nameInput) {

    nameInput.addEventListener(
        "keydown",
        function(event) {

            if (event.key === "Enter") {

                event.preventDefault();

                checkName();

            }

        }
    );

}

yesButton.addEventListener("click", function () {

    console.log("User selected YES");

    // Hide the fun fact and its buttons
    funFactSection.classList.add("hidden");

    // Show response
    feedbackResponse.classList.remove("hidden");

    feedbackMessage.textContent =
        "Yeah, it matches me! 😄 Wow, awesome! Maybe your name knows you better than you expected.";

});

noButton.addEventListener("click", function () {

    console.log("User selected NO");

    // Hide the fun fact and its buttons
    funFactSection.classList.add("hidden");

    // Show response
    feedbackResponse.classList.remove("hidden");

    feedbackMessage.textContent =
        "Oh! Sorry about that. 😅 Your response has been recorded for review.";

});

function checkName() {

    console.log("Submit button clicked!");


    const userName =
        nameInput.value.trim();


    // Empty name
    if (userName === "") {

        alert("Please enter your name.");

        return;

    }


    // Database hasn't loaded
    if (nameDatabase.length === 0) {

        alert(
            "The name database has not loaded yet. Please wait a moment and try again."
        );

        console.log(
            "Database currently contains:",
            nameDatabase.length,
            "names"
        );

        return;

    }


    console.log(
        "Searching database for:",
        userName
    );


    // Search for name
    const person =
        nameDatabase.find(
            person =>
                person.name.toLowerCase() ===
                userName.toLowerCase()
        );


    if (person) {

        console.log(
            "✅ Name found:",
            person
        );


        nameGreeting.textContent =
            `Nice to meet you, ${person.name}! 😊`;


        nameMeaning.textContent =
            `Your name has ${person.origin} roots and means "${person.meaning}". ✨`;


        funFact.textContent =
            person.funFact;


        // Show response
        nameResponse.classList.remove("hidden");


        // Show fun fact
        funFactSection.classList.remove("hidden");


        // Hide not-found message
        if (nameNotFoundSection) {

            nameNotFoundSection.classList.add("hidden");

        }


        // Hide input
        nameInputSection.classList.add("hidden");

    }

    else {

        console.log(
            "❌ Name not found:",
            userName
        );


        nameGreeting.textContent =
            `🤔 I couldn't find "${userName}" in my database.`;


        nameMeaning.textContent =
            "I'll flag this name for the admin to review.";


        // Show response
        nameResponse.classList.remove("hidden");


        // Hide fun fact
        funFactSection.classList.add("hidden");


        // Show not-found section
        if (nameNotFoundSection) {

            nameNotFoundSection.classList.remove("hidden");

        }


        // Hide input
        nameInputSection.classList.add("hidden");

    }

}



if (retryButton) {

    retryButton.addEventListener(
        "click",
        function() {

            console.log(
                "🔄 User wants to try another name"
            );


            // Hide responses
            nameResponse.classList.add("hidden");

            funFactSection.classList.add("hidden");

            nameNotFoundSection.classList.add("hidden");


            // Show name input
            nameInputSection.classList.remove("hidden");


            // Clear input
            nameInput.value = "";


            // Focus input
            nameInput.focus();

        }
    );

}

feedbackRetryButton.addEventListener("click", function () {
    console.log("Try Another Name clicked!");
    // Hide feedback response
    feedbackResponse.classList.add("hidden");
    // Hide previous name response
    nameResponse.classList.add("hidden");
    // Show name input
    nameInputSection.classList.remove("hidden");
    // Clear the input
    nameInput.value = "";
    // Put cursor back in input
    nameInput.focus();

});