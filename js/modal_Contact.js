import { onOpenModal, onCloseModal } from './app.js';

/* ============================= Gestion de la modale ============================= */

const mainWrapper = document.querySelector('.mainpage');
const photographModalContainer = document.querySelector('.modalcontainer');

// on utilise la délégation d'évènement sur contact
function modalManagement() {

    document.addEventListener('click', e => {
        if (e.target && e.target.className == 'contact__btn') {
            //do something
            onOpenModal(mainWrapper, photographModalContainer);
        }
    });
    document.addEventListener('click', e => {
        if (e.target && e.target.className == 'modal__close') {
            //do something
            onCloseModal(mainWrapper, photographModalContainer);
        }
    });
}

modalManagement(mainWrapper, photographModalContainer);

//----------------------------- Gestion de formulaire -----------------------------//

// Constantes applicatives
const nameRegex = /^[A-Za-z\s]{2,20}$/;
const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
const messageRegex = /^[A-Za-z0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]{5,200}$/;

// Constante techniques
const firstNameInput = document.querySelector('#firstname');
const lastNameInput = document.querySelector('#lastname');
const emailInput = document.querySelector('#email');
const messageArea = document.querySelector('#message');
const form = document.querySelector('#contact');

// Validation des regex
const nameIsValid = (name) => {return nameRegex.test(name);}
const emailIsValid = (email) => {return emailRegex.test(email);}
const messageIsValid = (message) => {return messageRegex.test(message);}

// Test des régex pour tester les styles
const validateInputFirstName = (e) => {
    const firstName = e.target.value;

    validateName(firstName, firstNameInput)
}
const validateInputLastName = (e) => {
    const lastName = e.target.value;

    validateName(lastName, lastNameInput)
}
const validateInputEmail = (e) => {
    const email = e.target.value;

    validateEmail(email, emailInput);
}
const validateTextareaMessage = (e) => {
    const message = e.target.value;

    validateMessage(message, messageArea)
}

// Selon le retour de la regex on stylise
function isValid(input) {
    input.classList.add('modal__input--valid');
    input.classList.remove('modal__input--error');
}
function notValid(input) {
    input.classList.add('modal__input--error');
}
const validateName = (name, input) => {
    if (nameIsValid(name)) {
        isValid(input);
    } else if(input.value === "") {
        notValid(input);
    }
    else {
        notValid(input);
    }
}
const validateEmail = (email, input) => {
    if (emailIsValid(email)) {
        isValid(input);
    } else if (input.value === "") {
        notValid(input);
    } else {
        notValid(input);
    }
}
const validateMessage = (message, textarea) => {
    if (messageIsValid(message)) {
        textarea.classList.add('modal__textarea--valid');
        textarea.classList.remove('modal__textarea--error');
    } else if (textarea.value === "") {
        textarea.classList.add('modal__textarea--error');
    }
    else {
        textarea.classList.add('modal__textarea--error');
    }
}

// Reset au submit
function submitResetInput() {
    for (let inputs of document.querySelectorAll('.modal__input')) {
        inputs.value = "";
        inputs.classList.remove('modal__input--valid');
    }
        messageArea.value = "";
        messageArea.classList.remove('modal__textarea--valid');
}

// Values "" au submit
function ifInputNotFill() {
    for (let inputs of document.querySelectorAll('.modal__input')) {
        if (inputs.value === "") {
            inputs.classList.add('modal__input--error');
            inputs.value = "Veuillez remplir ce champ";
        }
    }
    if(messageArea.value === "") {
        messageArea.classList.add('modal__textarea--error');
        messageArea.value = "Veuillez remplir le champ message avant validation.";
    }
}

// Compilation des retour true/false de chaque Regex
const firstNameFormValid = () => {
    return nameIsValid(firstNameInput.value);
}
const lastNameFormValid = () => {
    return nameIsValid(lastNameInput.value);
}
const emailFormValid = () => {
    return emailIsValid(emailInput.value);
}
const messageFormValid = () => {
    return messageIsValid(messageArea.value);
} 
const formIsValid = () => {
    return firstNameFormValid() && lastNameFormValid() && emailFormValid() && messageFormValid()
}
function submit(e) {
    if(formIsValid()) {
        e.preventDefault();
        console.log(firstNameInput.value);
        console.log(lastNameInput.value);
        console.log(emailInput.value);
        console.log(messageArea.value);
        submitResetInput();
    } else {
        e.preventDefault();
        ifInputNotFill();
    }
}

firstNameInput.addEventListener('input', validateInputFirstName);
lastNameInput.addEventListener('input', validateInputLastName);
emailInput.addEventListener('input', validateInputEmail);
messageArea.addEventListener('change', validateTextareaMessage);
form.addEventListener('submit', submit);