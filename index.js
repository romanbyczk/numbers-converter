"use strict";
const MIN_BASE_VALUE = 2;
const MAX_BASE_VALUE = 36;

const form = document.getElementsByTagName("form")[0];
form.addEventListener("submit", function onConvertClick(event) {
    event.preventDefault();
    hideMessages();
    const resultField = document.getElementById("result");
    const fromBase = document.getElementById("from_base").value;
    const toBase = document.getElementById("to_base").value;
    const input = document.getElementById("input").value;
    if (validate(fromBase, input)) {
        const result = getConversionResult(input, fromBase, toBase);
        if (result === undefined) {
            showMessage("input-error", "UNKNOWN ERROR");
        }
        resultField.innerText = result || "";
    }
});

function validate(fromBase, input) {
    if (!isInputValid(input, fromBase)) {
        showMessage("input-error", "Please write correct number in given base");
        return false;
    }
    return true;
}

function showMessage(fieldId, message) {
    document.getElementById(fieldId).innerText = message;
    document.getElementById(fieldId).style.display = "block";
}

function hideMessages() {
    document.getElementById("input-error").style.display = "none";
}

function getConversionResult(input, fromBase, toBase) {
    return parseInt(input, fromBase).toString(toBase);
}

function isInputInRange(value, min, max) {
    return !isNaN(value) && max >= value && value >= min;
}

function isInputValid(input, base) {
    if (!input) return false;
    let inputCharacters = input.toString().toUpperCase();
    inputCharacters = inputCharacters[0] === "-" ? inputCharacters.slice(1) : inputCharacters;
    inputCharacters =
        parseInt(base) === 16 && inputCharacters.slice(0, 2) === "0X" ? inputCharacters.slice(2) : inputCharacters;
    const pattern = base <= 10 ? `[0-${base - 1}]` : `[0-9A-${String.fromCharCode(base - 11 + 65)}]`;
    const wrongCharacter = [...inputCharacters].find((v) => !v.match(pattern));
    return !wrongCharacter;
}
