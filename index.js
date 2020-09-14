"use strict";
const template = document.createElement("template");

template.innerHTML = `
<link rel="stylesheet" href="main.css" />
<form class="converter-container" id="form">
            <ul>
                <li>
                    <label for="from_base">From base</label>
                    <input type="number" name="from_base" min="2" max="36" id="from_base" required />
                </li>
                <li>
                    <label for="to_base">To base</label>
                    <input type="number" name="to_base" min="2" max="36" id="to_base" required />
                </li>
                <li>
                    <label for="input">Input number</label>
                    <input type="text" name="input" id="input" required />
                    <span class="error-message" style="display: none" id="input-error">
                        Please write correct number
                    </span>
                </li>
                <li>
                    <input type="submit" value="Convert" />
                </li>
                <li>
                    <span id="result"></span>
                </li>
            </ul>
        </form>
`;

class NumbersConverter extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });
        this.shadowRoot.appendChild(template.content.cloneNode(true));
    }
    connectedCallback() {
        const MIN_BASE_VALUE = 2;
        const MAX_BASE_VALUE = 36;

        const form = this.shadowRoot.getElementById("form");
        const scopedRoot = this.shadowRoot;
        form.addEventListener("submit", function onConvertClick(event) {
            event.preventDefault();
            hideErrorMessage();
            const resultField = scopedRoot.getElementById("result");
            const fromBase = scopedRoot.getElementById("from_base").value;
            const toBase = scopedRoot.getElementById("to_base").value;
            const input = scopedRoot.getElementById("input").value;
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
            scopedRoot.getElementById(fieldId).innerText = message;
            scopedRoot.getElementById(fieldId).style.display = "block";
        }

        function hideErrorMessage() {
            scopedRoot.getElementById("input-error").style.display = "none";
        }

        function getConversionResult(input, fromBase, toBase) {
            return parseInt(input, fromBase).toString(toBase);
        }

        function isInputValid(input, base) {
            if (!input) return false;
            let inputCharacters = input.toString().toUpperCase();
            inputCharacters = inputCharacters[0] === "-" ? inputCharacters.slice(1) : inputCharacters;
            inputCharacters =
                parseInt(base) === 16 && inputCharacters.slice(0, 2) === "0X"
                    ? inputCharacters.slice(2)
                    : inputCharacters;
            const pattern = base <= 10 ? `[0-${base - 1}]` : `[0-9A-${String.fromCharCode(base - 11 + 65)}]`;
            const wrongCharacter = [...inputCharacters].find((v) => !v.match(pattern));
            return !wrongCharacter;
        }
    }
}
window.customElements.define("numbers-converter", NumbersConverter);
