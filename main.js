/* varibles globales */
const d = document;
let world;
let worldArray;
let userInput = [];
let targetInput = [];
let rightInput = [];
let contador = 0;

/* dom variables */
const $loader = d.querySelector(".loader");
const $main = d.querySelector(".main-container");
const $row = d.querySelector(".row");
const $result = d.querySelector(".result");
const $errorContainer = d.querySelector(".error-container");
const $errorMsg = d.querySelector(".error");
const $fragment = d.createDocumentFragment();
let $focusElement = "";

/* procedimiento */

/* peticion API */
fetch("https://palabras-aleatorias-public-api.herokuapp.com/random")
  .then((res) => {
    if (res.ok) {
      return res.json();
    } else {
      throw { status: res.status, statusText: res.statusText };
    }
  })
  .then((json) => {
    world = json.body.Word;
    worldArray = world.split("");

    if (world.length > 6 || /\s/g.test(world)) {
      $main.style.display = "none";
      location.reload();
    } else {
      $loader.style.display = "none";
      $main.style.display = "flex";
    }

    /* crear los inputs */
    worldArray.forEach((element, index) => {
      let input = d.createElement("input");
      input.classList.add("square");
      input.maxLength = 1;
      input.type = "text";
      input.id = index;

      if (index === 0) {
        input.classList.add("focus");
      }

      $fragment.appendChild(input);
    });

    $row.appendChild($fragment);

    $focusElement = d.querySelector(".focus");
    $focusElement.focus();
  })
  .catch((err) => console.log(err));

/* agregar y verificar input */
d.addEventListener("input", (e) => {
  if (e.target.matches(".square") && e.inputType === "insertText") {
    userInput[e.target.id] = e.target.value.toLowerCase();
    targetInput[e.target.id] = e.target;

    if (e.target.nextElementSibling) {
      e.target.nextElementSibling.focus();
    } else {
      /* comparar arrays y verificar valores*/
      verificarValores();
      compareArray(worldArray, userInput);

      /* comprobar si gano */
      if (
        rightInput.length === worldArray.length &&
        $errorMsg.innerHTML.length === 0
      ) {
        $result.innerHTML = `
        <p>Ganaste!</p>
        <button class="button">Reiniciar</button>
        `;

        $button = d.querySelector(".button");
        $button.focus();
      } else {
        /* remover el foco */
        $focusElement.classList.remove("focus");

        /* verificar si  perdio */
        contador++;

        if (contador === 5) {
          let div = d.createElement("div");
          div.innerHTML = `
            <p class="defeat">
              Intentalo de nuevo la palabra correcta era "<span>${world.toLocaleUpperCase()}</span>"
            </p>
            <button class="button">Reiniciar</button>
          `;
          $main.appendChild(div);

          $button = d.querySelector(".button");
          $button.focus();
        } else {
          userInput = [];
          targetInput = [];
          rightInput = [];
          createRow();
        }
      }
    }
  } else if (e.inputType === "deleteContentBackward") {
    userInput[e.target.id] = "";
  }
});

d.addEventListener("click", (e) => {
  /* reiniciar */
  if (e.target.matches(".button")) {
    location.reload();
  }
});

/* fucntions */
function compareArray(arr1, arr2) {
  for (let i = 0; i < arr1.length; i++) {
    if (arr1[i] === arr2[i]) {
      rightInput.push(arr2[i]);
      targetInput[i].classList.add("green");
    } else if (arr1.includes(arr2[i])) {
      targetInput[i].classList.add("gold");
    }
  }
}

function createRow() {
  let div = d.createElement("div");
  div.classList.add("row");

  worldArray.forEach((element, index) => {
    let input = d.createElement("input");
    input.classList.add("square");
    input.maxLength = 1;
    input.type = "text";
    input.id = index;

    if (index === 0) {
      input.classList.add("focus");
    }

    $fragment.appendChild(input);
  });

  div.appendChild($fragment);
  $main.appendChild(div);

  $focusElement = d.querySelector(".focus");
  $focusElement.focus();
}

function verificarValores() {
  let regExp = /[0-9]/;

  for (let i = 0; i < userInput.length; i++) {
    if (userInput[i] === "" || regExp.test(userInput[i])) {
      $errorMsg.innerHTML = `Error solo se pueden ingrsar letras`;
      $errorContainer.style.display = "block";
      return false;
    }
  }

  $errorMsg.innerHTML = "";
  $errorContainer.style.display = "none";
  return true;
}
