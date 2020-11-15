"use strict";
const template = document.createElement("template");

template.innerHTML = `
<link rel="stylesheet" href="src/main.css" />
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
        const form = this.shadowRoot.getElementById("form");
        form.addEventListener("submit", this.onConvertClick);
    }

    onConvertClick = (event) => {
        this.clearState(event);
        const result = this.transform(
            this.getInputValues({ fromBase: "from_base", toBase: "to_base", input: "input" })
        );
        this.shadowRoot.getElementById("result").innerText = result || "";
    };

    clearState = (event) => {
        event.preventDefault();
        this.hideErrorMessage("input-error");
    };

    showMessage = (fieldId, message) => {
        this.shadowRoot.getElementById(fieldId).innerText = message;
        this.shadowRoot.getElementById(fieldId).style.display = "block";
    };

    hideErrorMessage = (fieldId) => {
        this.shadowRoot.getElementById(fieldId).style.display = "none";
    };

    getInputValues = (fieldIds) => {
        const fromBase = this.shadowRoot.getElementById(fieldIds.fromBase).value;
        const toBase = this.shadowRoot.getElementById(fieldIds.toBase).value;
        const input = this.shadowRoot.getElementById(fieldIds.input).value;
        return { fromBase, toBase, input };
    };

    transform = ({ fromBase, toBase, input }) => {
        if (!this.validate(fromBase, input)) return;
        const result = this.convert(input, fromBase, toBase);
        if (isNaN(result)) this.showMessage("input-error", "UNKNOWN ERROR");
        return result;
    };

    convert = (input, fromBase, toBase) => {
        return parseInt(input, fromBase).toString(toBase).toUpperCase();
    };

    validate = (fromBase, input) => {
        if (this.isInputValid(input, fromBase)) return true;
        this.showMessage("input-error", "Please write correct number in given base");
    };

    isInputValid = (input, base) => {
        if (!input) return false;
        let inputCharacters = input.toString().toUpperCase();
        inputCharacters = inputCharacters[0] === "-" ? inputCharacters.slice(1) : inputCharacters;
        inputCharacters =
            parseInt(base) === 16 && inputCharacters.slice(0, 2) === "0X" ? inputCharacters.slice(2) : inputCharacters;
        const pattern = base <= 10 ? `[0-${base - 1}]` : `[0-9A-${String.fromCharCode(base - 11 + 65)}]`;
        const wrongCharacter = [...inputCharacters].find((v) => !v.match(pattern));
        return !wrongCharacter;
    };
}

window.customElements.define("numbers-converter", NumbersConverter);
