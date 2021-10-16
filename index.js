const baseUrl = "https://pokeapi.co/api/v2";

const userText = document.getElementById("search");
button.addEventListener("click", () => {
  //When the user clicks on the button the wanted pokemon shows up
  getPokemonsByIdOrName(userText.value);
});
userText.addEventListener("keydown", (e) => {
  //When the user press enter in the input box the wanted pokemon shows up
  if (e.key === "Enter") getPokemonsByIdOrName(userText.value.toLowerCase());
});

const getPokemonsByIdOrName = async (idOrName) => {
  //Gets some id and gives all data about the pokemon with the match id or his name
  try {
    removePreviousTypesFromDom(".newType");
    removePreviousTypesFromDom(".new-poke-by-type");
    const response = await axios.get(`${baseUrl}/pokemon/${idOrName}`);
    const recievedData = response.data;
    changeToBackDefaultOnHover(recievedData);
    showPokemonData(recievedData);
    getType();
  } catch (error) {
    alert("hey bud this pokemon doesn't exist.... try another one");
    console.error(error);
  }
};

function showPokemonData(recievedData) {
  //Get user data and shows it in the dom
  pokeNameVal.innerText = ` ${recievedData.name}`;
  pokeHeightVal.innerText = ` ${recievedData.height} cm`;
  pokeWeightVal.innerText = ` ${recievedData.weight} grams`;
  addSpan(recievedData);
}
function changeToBackDefaultOnHover(recievedData) {
  //Make the image change to back_default on hover
  pokeImg.src = recievedData.sprites.front_default;
  pokeImg.onmouseenter = function () {
    pokeImg.src = recievedData.sprites.back_default;
  };
  pokeImg.onmouseout = function () {
    pokeImg.src = recievedData.sprites.front_default;
  };
}

function removePreviousTypesFromDom(cls) {
  //Remove the old types of the previous pokemon from dom
  for (const newType of document.querySelectorAll(cls)) {
    newType.remove();
  }
}

function removeFromDom(cls) {
  //Delete some related elements(by tags/class) from dom
  for (const element of document.querySelectorAll(cls)) {
    element.remove();
  }
}

function getType() {
  //The function gets the types of the pokemon
  pokeTypesVal.addEventListener("click", async (e) => {
    const typeText = e.target.textContent
      .replaceAll("|", "")
      .replaceAll(" ", "");
    const response = await axios.get(`${baseUrl}/type/${typeText}`);
    renderPokemonsToDom(response.data.pokemon);
    document
      .getElementById("related-pokemons")
      .addEventListener("click", (e) => {
        e.stopImmediatePropagation();
        userText.value = e.target.textContent;
        getPokemonsByIdOrName(e.target.textContent);
      });
    window.scrollTo(0, 300);
  });
}

function addSpan(recievedData) {
  //Add a span with the types of the pokemon
  for (let i = 0; i < recievedData.types.length; i++) {
    const newSpan = document.createElement("span");
    newSpan.classList.add("newType");
    newSpan.innerHTML = ` ${recievedData.types[i].type.name}</br> `;
    pokeTypesVal.append(newSpan);
  }
}

function renderPokemonsToDom(pokemons) {
  //Render the pokemons with the same type as a list
  removePreviousTypesFromDom(".new-poke-by-type");
  pokemons.forEach((pokemon) => {
    const newList = document.createElement("li");
    newList.className =
      "new-poke-by-type list-group-item list-group-item-action list-group-item-dark";
    newList.textContent = pokemon.pokemon.name;
    document.getElementById("related-pokemons").append(newList);
  });
}
