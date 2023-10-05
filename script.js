"use strict";

// Elements
const digitsBtns = document.querySelectorAll(".digits");
const operations = document.querySelectorAll(".operations");
const clearBtn = document.getElementById("clear");
const deleteBtn = document.getElementById("delete");
const percentageBtn = document.getElementById("percentages");
const equals = document.getElementById("equals");
const output = document.getElementById("output");

// initial values
let firstValue = "";
let secondValue = "";
let operator = null;
let inputMode = "first";

// Event listeners
clearBtn.addEventListener("click", clear);

digitsBtns.forEach((digit) =>
    digit.addEventListener("click", () => {
        handleDigitClick(digit.textContent);
        removeActive();
    })
);

equals.addEventListener("click", () => {
    calculate();
});

operations.forEach((operation) => {
    operation.addEventListener("click", () => {
        toggleActive(operation);
        selectOperation(operation);
    });
});

// Logic
function selectOperation(operation) {
    if (!firstValue) {
        firstValue = "0";
    }

    if (firstValue && secondValue) {
        calculate();
    }
    operator = operation.textContent;
    inputMode = "second";
}

function handleDigitClick(digit) {
    if (inputMode === "result") {
        firstValue = digit;
        inputMode = "first";
    } else if (inputMode === "first") {
        firstValue += digit;
    } else if (inputMode === "second") {
        secondValue += digit;
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

// UI changes
function populateDisplay(value) {
    output.textContent = value || "0";
}

function clear() {
    firstValue = "";
    secondValue = "";
    operator = null;
    inputMode = "first";

    removeActive();
    populateDisplay();
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
