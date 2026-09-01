
let nameDatabase = [];

const nameInput = document.getElementById("userInputName");
const sendNameButton = document.getElementById("sendNameButton");
const nameInputSection = document.getElementById("nameInputSection");
const nameResponse = document.getElementById("nameResponse");
const funFactSection = document.getElementById("funFactSection");
const nameNotFoundSection = document.getElementById("nameNotFoundSection");
const nameGreeting = document.getElementById("nameGreeting");
const nameMeaning = document.getElementById("nameMeaning");
const funFact = document.getElementById("funFact");
const nameNotFoundMessage = document.getElementById("nameNotFoundMessage");
const retryButton = document.getElementById("retryButton");
// ==========================================
// 3. Load names.csv
// ==========================================

fetch("names.csv")
    .then(response => {

        if (!response.ok) {
            throw new Error("Could not find names.csv");
        }

        return response.text();

    })

    .then(data => {

        console.log("✅ names.csv loaded!");

        nameDatabase = parseCSV(data);

        console.log("✅ Names loaded:", nameDatabase.length);

        console.log(nameDatabase);

    })

    .catch(error => {

        console.error("❌ CSV ERROR:", error);

    });


// ==========================================
// 4. CSV Parser
// Handles commas inside quotes
// ==========================================

function parseCSV(data) {

    const rows = [];
    let row = [];
    let value = "";
    let insideQuotes = false;

    for (let i = 0; i < data.length; i++) {

        const character = data[i];

        // If we find a quote
        if (character === '"') {

            // Handle double quotes inside quoted text
            if (insideQuotes && data[i + 1] === '"') {

                value += '"';
                i++;

            } else {

                insideQuotes = !insideQuotes;

            }

        }

        // Comma outside quotes = next column
        else if (character === "," && !insideQuotes) {

            row.push(value.trim());
            value = "";

        }

        // New line outside quotes = next row
        else if (
            (character === "\n" || character === "\r") &&
            !insideQuotes
        ) {

            if (character === "\r" && data[i + 1] === "\n") {
                i++;
            }

            row.push(value.trim());
            value = "";

            if (row.length > 0) {
                rows.push(row);
            }

            row = [];

        }

        else {

            value += character;

        }
    }


    // Add final value
    if (value.length > 0 || row.length > 0) {

        row.push(value.trim());
        rows.push(row);

    }


    // Remove header row
    rows.shift();


    // Convert rows into objects
    return rows.map(row => {

        return {

            name: row[0] || "",
            origin: row[1] || "",
            meaning: row[2] || "",
            funFact: row[3] || ""

        };

    });

}


// ==========================================
// 5. Button
// ==========================================

sendNameButton.addEventListener("click", checkName);


// ==========================================
// 6. Enter key
// ==========================================

nameInput.addEventListener("keydown", function(event) {

    if (event.key === "Enter") {

        event.preventDefault();

        checkName();

    }

});


// ==========================================
// 7. Check name
// ==========================================

function checkName() {

    const userName = nameInput.value.trim();


    // ------------------------------------------
    // Empty input
    // ------------------------------------------

    if (userName === "") {

        alert("Please enter your name.");

        return;

    }


    // ------------------------------------------
    // CSV hasn't loaded yet
    // ------------------------------------------

    if (nameDatabase.length === 0) {

        alert("The name database is still loading. Please try again.");

        return;

    }


    console.log("🔎 Searching for:", userName);


    // ------------------------------------------
    // Search CSV
    // ------------------------------------------

    const person = nameDatabase.find(person => {

        return person.name.toLowerCase() === userName.toLowerCase();

    });


    // ------------------------------------------
    // Name found
    // ------------------------------------------

    if (person) {

        console.log("✅ Name found:", person);


        nameGreeting.textContent =
            `Nice to meet you, ${person.name}! 😊`;


        nameMeaning.textContent =
            `Your name has ${person.origin} roots and means "${person.meaning}". ✨`;


        funFact.textContent =
            person.funFact;


        // Show the response
        nameResponse.classList.remove("hidden");

        funFactSection.classList.remove("hidden");


        // Hide name input
        nameInputSection.classList.add("hidden");

    }


    // ------------------------------------------
    // Name NOT found
    // ------------------------------------------

    else {

        else {

    console.log("❌ Name not found:", userName);

    nameGreeting.textContent =
        `🤔 I couldn't find "${userName}" in my database.`;

    nameMeaning.textContent =
        "I'll flag this name for the admin to review.";

    // Show name response
    nameResponse.classList.remove("hidden");

    // Show NOT FOUND section
    nameNotFoundSection.classList.remove("hidden");

    // Make sure fun fact stays hidden
    funFactSection.classList.add("hidden");

    // Hide name input
    nameInputSection.classList.add("hidden");
}
    }

}