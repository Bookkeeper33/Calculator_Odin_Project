"use strict";

// Elements
const digitsBtns = document.querySelectorAll(".digits");
const operationsBtns = document.querySelectorAll(".operations");
const clearBtn = document.getElementById("clear");
const signBtn = document.getElementById("sign");
const percentageBtn = document.getElementById("percentages");
const equalsBtn = document.getElementById("equals");
const output = document.getElementById("output");

// initial values
let firstValue = "";
let secondValue = "";
let operator = null;
let inputMode = "first";

// Event listeners
clearBtn.addEventListener("click", clear);
signBtn.addEventListener("click", () => {
    useUtility(changeSign);
});
percentageBtn.addEventListener("click", () => {
    useUtility(findPercentage);
});

digitsBtns.forEach((digit) =>
    digit.addEventListener("click", () => {
        handleDigitClick(digit.textContent);
        removeActive();
    })
);

equalsBtn.addEventListener("click", () => {
    calculate();
});

operationsBtns.forEach((operation) => {
    operation.addEventListener("click", () => {
        toggleActive(operation);
        selectOperation(operation.textContent);
    });
});

window.addEventListener("keydown", handleKeyBoardInput);

// Logic
function selectOperation(operation) {
    if (!firstValue) {
        firstValue = "0";
    }

    if (firstValue && secondValue) {
        calculate();
    }
    operator = operation;
    inputMode = "second";
}

function handleDigitClick(digit) {
    if (inputMode === "result") {
        firstValue = digit;
        inputMode = "first";
    } else {
        const currentValue = inputMode === "first" ? firstValue : secondValue;
        if (
            (currentValue === "0" || output.textContent === "0") &&
            digit === "."
        ) {
            // Add '.' to the current value if it's '0'
            inputMode === "first" ? (firstValue = "0.") : (secondValue = "0.");
        } else {
            // Append the digit to the current value
            inputMode === "first"
                ? (firstValue += digit)
                : (secondValue += digit);
        }
        inputMode = inputMode === "first" ? "first" : "second";
    }

    populateDisplay(inputMode === "first" ? firstValue : secondValue);
    console.log("First:", firstValue, "\nSecond: ", secondValue);
}

function calculate() {
    if (!firstValue || !secondValue || !operator) {
        return;
    }

    firstValue = operate(firstValue, secondValue, operator);
    secondValue = "";
    operator = null;
    inputMode = "result";

    populateDisplay(firstValue);
}

function operate(a, b, operand) {
    a = parseFloat(a);
    b = parseFloat(b);
    let results;

    switch (operand) {
        case "➗":
            results = divide(a, b);
            break;
        case "✖️":
            results = multiply(a, b);
            break;
        case "➕":
            results = add(a, b);
            break;
        case "➖":
            results = subtract(a, b);
            break;
    }

    if (!Number.isInteger(results)) {
        return results.toFixed(3).toString();
    }

    return results.toString();
}

function add(a, b) {
    return a + b;
}

function subtract(a, b) {
    return a - b;
}

function multiply(a, b) {
    return a * b;
}

function divide(a, b) {
    if (b === 0) {
        return new Error("Can't divide by zero, bro :)");
    }

    return a / b;
}

function useUtility(callback) {
    if (inputMode === "first" || inputMode === "result") {
        firstValue = callback(firstValue);
    } else {
        secondValue = callback(secondValue);
        console.log(secondValue);
    }

    populateDisplay(
        inputMode === "first" || inputMode === "result"
            ? firstValue
            : secondValue
    );
}

function findPercentage(value) {
    return parseFloat(value / 100).toString();
}

function changeSign(value) {
    return parseFloat(value * -1).toString();
}

function handleKeyBoardInput(event) {
    event.preventDefault();

    if ((event.key >= 0 && event.key <= 9) || event.key === ".")
        handleDigitClick(event.key);
    if (event.key === "Escape") clear();
    if (event.key === "=" || event.key === "Enter") calculate();
    if (
        event.key === "+" ||
        event.key === "-" ||
        event.key === "*" ||
        event.key === "/"
    )
        selectOperation(convertOperator(event.key));
}

function convertOperator(operator) {
    switch (operator) {
        case "/":
            operator = "➗";
            break;
        case "*":
            operator = "✖️";
            break;
        case "+":
            operator = "➕";
            break;
        case "-":
            operator = "➖";
            break;
    }

    return operator;
}

// UI changes
function populateDisplay(value) {
    if (value.length > 14) {
        return;
    }
    output.textContent = value;
}

function clear() {
    firstValue = "";
    secondValue = "";
    operator = null;
    inputMode = "first";

    removeActive();
    populateDisplay("0");
}

function removeActive() {
    document.querySelector("button.active")?.classList.remove("active");
}

function toggleActive(item) {
    if (!document.querySelector("button.active")) {
        item.classList.add("active");
        return;
    }
    removeActive();
    item.classList.add("active");
}
