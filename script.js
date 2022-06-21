let loading = false;

const display = document.querySelector("#display");
const displayTitle = document.querySelector("#displayTitle");
const searchInput = document.querySelector("#searchForm");
const searchButton = document.querySelector("#store_search_link");
const categoryGroup = document.querySelector(".categoryGroup");

const fetchData = async (endpoint, value = " ") => {
  let url = `https://cs-steam-game-api.herokuapp.com/${endpoint}${value}`;

  if (loading) return;
  display.innerHTML = `<div class="loader"> Loading ...</div>`;

  // if (endpoint === "search") url += "/page/1";
  try {
    loading = true;
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "x-rapidapi-host": "cs-steam-game-api.herokuapp.com"
      }
    });
    const res = await response.json();
    // console.log("endpoint", endpoint);
    console.log("data", res);
    loading = false;
    return res.data;
  } catch (error) {
    loading = false;
    console.log("error fetch data", endpoint);
    renderDisplay(error.msg);
  }
};

const fetchData1 = async (appid) => {
  if (loading) return;
  display.innerHTML = `<div class="loader"> Loading ...</div>`;
  let data = {};

  let url = `https://cs-steam-game-api.herokuapp.com/single-game/${appid}`;

  try {
    loading = true;
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "x-rapidapi-host": "cs-steam-game-api.herokuapp.com"
      }
    });
    data = await response.json();
    // console.log("endpoint", endpoint);
    // console.log("data-appid", data);
    loading = false;
    return data.data;
  } catch (error) {
    console.log("error fetch data", appid);
    renderDisplay(error.msg);
  }
};
//Image on click
const renderDetail = (data) => {
  display.innerHTML = "";
  displayTitle.innerHTML = data.name;

  const newDiv = document.createElement("div");
  newDiv.innerHTML = `<div class="showing_game show_detail">
    <div class="title_contain ">
    <div class="title">${data.name}</div>
    <div class="price">${data.price}</div>
    </div>
    <div class="img_detail">
    <img
    src="${data.header_image}"
    alt="${data.name}"
    />
    <div class="game_details">
    <div class="game_description">${data.description}</div>
    <div class="game_informations">
    
    <p>POSITIVE RATING: ${data.positive_ratings}</p>
    <p>NEGATIVE RATING: ${data.negative_ratings}</p>
    <p>AVERAGE PLAYTIME: ${data.average_playtime}</p>
    <p>RELEASE DATE:  ${data.release_date}</p>
    
    <p>DEVELOPER: ${data.developer}</p>
    </div>
    </div>
    </div>
    <div class="tags_contain">
    Popular user-defined tags for this product:
    <div class="tags">
    <div class="tag">${data.categories[0]}</div>
    <div class="tag">${data.categories[1]}</div>
    <div class="tag">${data.categories[2]}</div>
    <div class="tag">${data.categories[3]}</div>
    <div class="tag">${data.categories[4]}</div>
    <div class="tag">${data.categories[5]}</div>
    <div class="tag">${data.categories[6]}</div>

  
    </div>
    </div>
    </div>
    `;
  display.appendChild(newDiv);
};

const appDetail = async (appid) => {
  // console.log("appid", appid);
  const data = await fetchData1(appid);
  renderDetail(data);
};
const renderGame = (el) => {
  const newDiv = document.createElement("div");

  newDiv.innerHTML = `<div class="game_wrapper">
    <div class="cover" onClick="appDetail(${el["appid"]})">
    <img
    src="${el["header_image"].replace(/\/\w+.jpg/, "/header.jpg")}" data-id="${
    el["appid"]
  }"
    />
    <div class="game_info">
    <p>${el["name"]}</p>
    <p>${el["price"]}</p>
    </div>
    </div>
    </div>`;
  display.appendChild(newDiv);
};
const renderGenresList = (el) => {
  categoryGroup.innerHTML += `<li>${el.name}</li>`;
};

const renderDisplay = async () => {
  display.innerHTML = "";

  const genres = await fetchData("genres", "");
  genres.map((game) => renderGenresList(game));

  const data = await fetchData("games");
  data.map((game) => renderGame(game));
};

// Category click (API search by Category term)
categoryGroup.addEventListener("click", async (e) => {
  display.innerHTML = "";
  const value = e.target.innerText;
  // console.log("value-------", value);
  const data = await fetchData("games", `?genres=${value}`);
  // console.log("data123", data);
  if (data) {
    data.map((game) => renderGame(game));
  }
  displayTitle.innerHTML = e.target.innerText;
});

//First load
renderDisplay();

// Search for games by app name
searchButton.addEventListener("click", async () => {
  display.innerHTML = "";
  const value = searchInput.value;
  // console.log("value-------", value);
  const data = await fetchData("games", `?q=${value}`);
  // console.log("data123", data);
  if (data) {
    data.map((game) => renderGame(game));
  }
  displayTitle.innerHTML = searchInput.value;
  searchInput.value = "";
});
