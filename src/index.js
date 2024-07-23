let addToy = false;

document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  addBtn.addEventListener("click", () => {
    // hide & seek with the form
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";
    } else {
      toyFormContainer.style.display = "none";
    }
  });
});

fetch("http://localhost:3000/toys")
  .then(function (response) {
    return response.json();
  })
  .then(function (data) {
    const toyCollection = document.getElementById("toy-collection");
    console.log(toyCollection);
    data.forEach(function (toy) {
      const card = document.createElement("div");
      
      card.classList.add("card");
      toyCollection.appendChild(card);
      card.innerHTML = `
      <h2>${toy.name}</h2>
      <img src="${toy.image}" class="toy-avatar" />
      <p>${toy.likes} Likes</p>
      <button class="like-btn" id="toy-${toy.id}">Like ❤️</button>
      `
      
      const likeBtn = card.querySelector(".like-btn");
      likeBtn.addEventListener("click", function (event) {
        event.preventDefault();
        handleLikeBtnClick(toy.id);
      })
    })
    

  })

const createToyForm = document.querySelector(".add-toy-form");
createToyForm.addEventListener("submit", function (event) {
  event.preventDefault();
  const toyName = createToyForm.name.value;
  const toyImage = createToyForm.image.value;

  fetch("http://localhost:3000/toys", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json"
    },
  
    body: JSON.stringify({
      "name": toyName,
      "image": toyImage,
      "likes": 0
    })
  })
})

function handleLikeBtnClick(toyId) {
  fetch(`http://localhost:3000/toys/${toyId}`)
    .then(response => response.json())
    .then(toy => {
      const newLikes = toy.likes + 1;
      const patchData = {likes: newLikes};

      fetch(`http://localhost:3000/toys/${toyId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json"
        },
        body: JSON.stringify(patchData)
      })
      .then(response => response.json())
      .then(patchedToy => {
        const card = document.getElementById(`toy-${toyId}`);
        card.querySelector("p").textContent = `${patchedToy.likes} Likes`;
      })
    })
}

