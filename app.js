const BASE_URL =
    "https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies";

const dropdowns = document.querySelectorAll(".dropdown-select");
const btn = document.querySelector("form button");

const fromCurr = document.querySelector(".from select");
const toCurr = document.querySelector(".to select");

const msg = document.querySelector(".msg");


// Add currencies to dropdowns
for (let select of dropdowns) {

    for (let currCode in countryList) {

        let newOption = document.createElement("option");

        newOption.innerText = currCode;
        newOption.value = currCode;

        if (select.name === "from" && currCode === "USD") {
            newOption.selected = true;
        }
        else if (select.name === "to" && currCode === "INR") {
            newOption.selected = true;
        }

        select.append(newOption);
    }


    // Change flag when currency changes
    select.addEventListener("change", (evt) => {
        updateFlag(evt.target);
    });
}


// Update flag
const updateFlag = (element) => {

    let currCode = element.value;

    let countryCode = countryList[currCode];

    let newSrc =
        `https://flagsapi.com/${countryCode}/flat/64.png`;

    let img =
        element.parentElement.querySelector("img");

    img.src = newSrc;
};


// Get exchange rate
btn.addEventListener("click", async (evt) => {

    evt.preventDefault();

    let amount = document.querySelector(".amount input");

    let amtVal = amount.value;

    if (amtVal === "" || amtVal < 1) {
        amtVal = 1;
        amount.value = "1";
    }


    try {

        // Example:
        // USD -> INR
        // https://.../currencies/usd.json

        const URL =
            `${BASE_URL}/${fromCurr.value.toLowerCase()}.json`;

        console.log("URL:", URL);

        let response = await fetch(URL);

        if (!response.ok) {
            throw new Error("API request failed");
        }

        let data = await response.json();

        console.log("Data:", data);


        // Get rate
        let fromCode = fromCurr.value.toLowerCase();
        let toCode = toCurr.value.toLowerCase();

        let rate = data[fromCode][toCode];


        // Calculate
        let finalAmount = amtVal * rate;


        // Display
        msg.innerText =
            `${amtVal} ${fromCurr.value} = ${finalAmount.toFixed(2)} ${toCurr.value}`;

    }
    catch (error) {

        console.error("Error:", error);

        msg.innerText =
            "Unable to get exchange rate. Please try again.";
    }
});