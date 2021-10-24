// const realUrl = "https://pokeapi.co/api/v2";
const baseUrl = "http://localhost:8080";

const userText = document.getElementById("search");
button.addEventListener("click", () => {
  window.scrollTo(0, 300);
  //When the user clicks on the button the wanted pokemon shows up
  getPokemonsByIdOrName(userText.value.toLowerCase());
});
userText.addEventListener("keydown", (e) => {
  //When the user press enter in the input box the wanted pokemon shows up
  if (e.key === "Enter"){ getPokemonsByIdOrName(userText.value.toLowerCase());
    window.scrollTo(0, 300);
  }
});

const getPokemonsByIdOrName = async (idOrName) => {
  //Gets some id and gives all data about the pokemon with the match id or his name
  try {
    removePreviousTypesFromDom(".newType");
    removePreviousTypesFromDom(".new-poke-by-type");
    const response = await getPokemonByNameOrId(idOrName)
    const recievedData = response.data;
    changeToBackDefaultOnHover(recievedData);
    showPokemonData(recievedData);
    getType();
  } catch (error) {
    // coolAlert()
    alert("hey bud this pokemon doesn't exist.... try another one");
    console.error(error);
  }
};  


    async function getPokemonByNameOrId(idOrName){
      let response  
      if(!isNaN(idOrName))
      response = await axios.get(`${baseUrl}/pokemon/get/${idOrName}`);
      else 
      response = await axios.get(`${baseUrl}/pokemon/query?name=${idOrName}`);
      return response
    }

// function coolAlert(){
//   Swal.fire({
//     icon: 'error',
//     title: 'Oops...',
//     text: 'Something went wrong!',
//     footer: '<a href="">Why do I have this issue?</a>'
//   })
// }

      function showPokemonData(recievedData) {
        //Get user data and shows it in the dom
        // console.log(pokeId.className);
        pokeId.textContent = recievedData.id;
        pokeNameVal.textContent = ` ${recievedData.name}`;
        pokeHeightVal.textContent = ` ${recievedData.height} cm`;
        pokeWeightVal.textContent = ` ${recievedData.weight} grams`;
        addSpan(recievedData);
      }
      function changeToBackDefaultOnHover(recievedData) {
        //Make the image change to back_default on hover
        pokeImg.src = recievedData.front_pic;
        pokeImg.onmouseenter = function () {
          pokeImg.src = recievedData.back_pic;
        };
        pokeImg.onmouseout = function () {
          pokeImg.src = recievedData.front_pic;
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

      catchButton.onclick = async ()=>{
      if(document.getElementById('connect').textContent === ''){//then you cant catch
      alert("you can't catch pokemons if you aren't logged in")
      return
      }
      if(pokeNameVal.textContent === ''){
      alert('you must search some pokemon to catch one')
      return
      }
      const pokemonId = pokeId.textContent
      const userName =  document.getElementById('connect').textContent.split('').splice(14).join('')
      const response =  await axiosRequest('put',`pokemon/catch/${pokemonId}`,userName)
      if(!response)
      alert('Pokemon already caught')
      else
      alert(response)
    }

      releaseButton.onclick = async ()=>{
        if(document.getElementById('connect').textContent === '')//then you cant release
        return
        const userName =  document.getElementById('connect').textContent.split('').splice(14).join('')
        const response =  await axiosRequest('put','pokemon/catch/${pokemonName}',userName) 
        alert(response)
        }


      signInButton.onclick = async ()=>{//for sign up to web
        const userNameVal = userNameSignIn.value
        if(!userNameVal){
          alert('type something...')
          return
          }
          const response =  await axiosRequest('get','users/info/login',userNameVal) // users/
          // console.log(response);
          if(response){//if there is such username
            alert('you just logged in try to catch some pokemons!')
            connected(userNameVal)//show the connected sign
          }
          else{
          alert("your username doesn't exsist, click the link below to sign up!")
          document.getElementById('connect').textContent = ''
          }
      }

        function connected(userName){
          const connectNofiaction = document.getElementById('connect')
          connectNofiaction.className = 'connected'
          connectNofiaction.textContent = `connected as: ${userName}`
          connectNofiaction.style.color = 'green'
        }
      
        async function axiosRequest(methodPath,partialPath,userName)
          {
            try {
              const response = await axios({
                method: methodPath,
                url: `${baseUrl}/${partialPath}` ,
                body: {
                },
                headers: {
                username: userName
              },
              });
              return response.data
            } catch (e) {
              console.log(e);;
            }
          }


       signUpButton.onclick = async ()=>{//for sign up to web
        const userNameVal = userNameSignUp.value
        if(!userNameVal){
        alert('type something...')
        return
        }
      const response =  await axiosRequest('post','users/info',userNameVal) // users/ 
      alert(response)
      }


  