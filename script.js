const BASE_URL = "https://2024-03-06.currency-api.pages.dev/v1/currencies";//api
const dropdownOptions = document.querySelectorAll(".drop_down select");
const btn = document.querySelector("form button");
const msg = document.querySelector(".msg");

let from = null; // Default 'from' currency code (lowercase for API)
let to = null;   // Default 'to' currency code (lowercase for API)

// Event listeners for dropdowns to update selected currencies and flags
for (let select of dropdownOptions) {
    select.addEventListener("change", (e) => {
        
        console.log("e.target=",e.target);
        
        changeFlag(e.target);
    });
}

// Function to update the flag and selected currency
const changeFlag = (element) => {
    const countryCode = element.value.toUpperCase(); // Use uppercase for flags API
    const currency = element.options[element.selectedIndex].innerText.toLowerCase(); // Use lowercase for API

    if (element.id === "from_currency") {
        from = currency; // Currency code for API, e.g., "usd"
    } else {
        to = currency; // Currency code for API, e.g., "inr"
    }

    // Update flag image
    const newFlag = `https://flagsapi.com/${countryCode}/flat/64.png`;
    const flagImg = element.parentElement.querySelector("img");
    //console.log(element.parentElement);
    
    flagImg.src = newFlag;
    flagImg.onerror = () => {
        flagImg.src = "https://via.placeholder.com/64?text=No+Flag"; // Fallback if flag is not available
    };

    console.log("From:", from, "To:", to);
    updateVal(from, to,1); // Update conversion rate dynamically
};

// Function to fetch conversion rates and display the result
async function updateVal(from, to,amtValue) {
    if(from!==null && to!==null) {
    try {
        const url = `${BASE_URL}/${from}.json`; // Currency code in lowercase for API
        console.log("Fetching URL OF CURRENCY:", url);

        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (data[from] && data[from][to]) {
            const rate = data[from][to];
            let converted=rate*amtValue
            msg.innerText = `${amtValue} ${from.toUpperCase()} = ${converted} ${to.toUpperCase()}`;
            console.log(`Conversion Rate: 1 ${from.toUpperCase()} = ${rate} ${to.toUpperCase()}`);
        } else {
            msg.innerText = `Conversion rate not found for ${from.toUpperCase()} to ${to.toUpperCase()}`;
        }
    } catch (error) {
        console.error("Error fetching data:", error);
        msg.innerText = "Error fetching conversion data. Please try again.";
    }
    finally {
        btn.disabled = false; // Re-enable button after fetching data,if error occurs without this block button remains disabled,with this it will be re enabled when error occurs and we can click it agin
    }
}
}

// Button click listener to handle amount conversion
btn.addEventListener("click", (e) => {
    e.preventDefault(); // Stop form from refreshing the page
    const amountInput = document.querySelector("form input");
    let amtValue = parseFloat(amountInput.value);

    if (isNaN(amtValue) || amtValue <= 0) {
        amtValue = 1; // Default to 1 if input is invalid
        amountInput.value = "1";
    }

    console.log("Amount to convert:", amtValue);

    updateVal(from, to,amtValue); // Trigger conversion update
});
