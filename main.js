const UrlBase = "https://api.thedogapi.com/v1/";
const UrlBase1 = "https://api.thedogapi.com/v1";
const API_KEY =
  "live_ijWv5TkjKhTHxIY5z1aJaHoBXlM0K9aOlCIJ8NurG65aXbGuo0ZVCZjft31BGOuX";

const instance = axios.create({
  baseURL: UrlBase1,
  headers: { "X-API-KEY": API_KEY },
});

const favorites = "/favourites";
const imageSearch = "/images/search";
const imageUpload = "/images/upload";

const URLDog_Search = UrlBase + "images/search";
const Doggie_Search = UrlBase + "images/search?limit=3";
const Doggie_Favorites = UrlBase + "favourites/";
const Doggie_UploadImage = UrlBase + "images/upload";
const Doggie_GetImage = UrlBase + "images";

const ApiKeyParam = "&api_key=" + API_KEY;
const Doggie_URL_Favorites = Doggie_Favorites + "?limit=9";

const spanError = document.getElementById("error");

async function getRandomDoggie() {
  const { data, status } = await instance
    .get(imageSearch, { params: { limit: 3 } })
    .catch(function (error) {
      errorMessage(error.toJSON());
    });
  if (status === 200) {
    const size = data.length;
    var i = 1;
    const htmlPosition = GetSectionAndCleanBeforeShowImages("random");

    data.forEach((doggie) => {
      const article = document.createElement("article");
      const valueId = "doggie_" + i;
      const img = createImage(doggie.url);
      img.setAttribute("id", valueId);
      img.setAttribute("alt", "Doggie " + i);
      const btnSave = createFavBtn(doggie.id);
      const div = document.createElement("div");
      div.className = "text-end";
      article.appendChild(img);
      article.appendChild(div).appendChild(btnSave);
      htmlPosition.appendChild(article);
      if (i <= size) i++;
    });
  }
}

async function getFavoritesDoggies() {
  const { data, status } = await instance
    .get(favorites, { params: { limit: 9 } })
    .catch(function (error) {
      errorMessage(error.toJSON());
    });
  if (status === 200) {
    const htmlPosition = GetSectionAndCleanBeforeShowImages(
      "listFavoritesDoggies"
    );
    data.forEach((doggie) => {
      const article = document.createElement("article");
      const div = document.createElement("div");
      div.className = "text-center";
      article.appendChild(createImage(doggie.image.url));
      article.appendChild(div).appendChild(createDeleteBtn(doggie.id));
      htmlPosition.appendChild(article);
    });
  }
  
  // Búsqueda con try-catch
  // try {
  //   const res = await fetch(Doggie_URL_Favorites, {
  //     method: "GET",
  //     headers: {
  //       "X-API-KEY": API_KEY,
  //     },
  //   });
  //   const status = res.status;
  //   if (status !== 200)
  //     throw new Error(`URL: ${Doggie_Favorites} - Status: ${status}`);
  //   const data = await res.json();

  // } catch (error) {
  //   errorMessage(error);
  //}
}

async function saveDoggie(paramId) {
  const { data, status } = await instance.post(favorites, {
    image_id: paramId,
  });
  if (status === 200) {
    getFavoritesDoggies();
  }
  // Forma básica
  // const res = await fetch(Doggie_URL_Favorites, {
  //   method: "POST",
  //   headers: {
  //     "Content-Type": "application/json",
  //     "X-API-KEY": API_KEY,
  //   },
  //   body: JSON.stringify({
  //     image_id: paramId,
  //   }),
  // });
}

async function deleteFavoriteDoggieById(paramId) {
  const getUrlWithId = Doggie_Favorites + paramId;
  const res = await fetch(getUrlWithId, {
    method: "DELETE",
    headers: { "Content-Type": "application/json", "X-API-KEY": API_KEY },
  });
  if (res.status === 200) {
    getFavoritesDoggies();
  }
}

async function DoggieExistsInFavorites(paramId) {
  const getUrlWithId = Doggie_Favorites + paramId;
  const res = await fetch(getUrlWithId, {
    method: "GET",
    headers: { "Content-Type": "application/json", "X-API-KEY": API_KEY },
  });
  return res.status == 200;
}

async function UploadDoggie() {
  const form = document.getElementById("uploadingDoggie");
  const formData = new FormData(form);
  const res = await fetch(Doggie_UploadImage, {
    method: "POST",
    headers: { "X-API-KEY": API_KEY },
    body: formData,
  });
  console.log("UploadDoggie");
  console.log(res);
  errorMessage(res);
}

async function errorMessage(response) {
  var vResult = true;
  if (response.status !== 200) {
    vResult = false;
    var emoji;
    emoji =
      response.status == 401 ? "🔐" : response.status == 500 ? "😞" : "😶";
    const textError = `${emoji} An error has ocurred: ${response.status} ${response.message}`;
    console.error(textError);
    spanError.innerText = textError;
    spanError.style.display = "block";
  }
  return vResult;
}

async function getImageDoggie() {
  await fetch(Doggie_GetImage, {
    headers: { "X-API-KEY": API_KEY },
  })
    .then((response) => response.json())
    .then((data) => {
      var size = data.length;
      var i = 1;
      data.forEach((doggie) => {
        const htmlPosition = document.getElementById("uploadedByUser");
        const article = document.createElement("article");
        const img = createImage(doggie.url);
        img.setAttribute("id", "doggie_" + i);
        img.setAttribute("alt", "Doggie " + i);
        const div = document.createElement("div");
        div.className = "text-end";
        article.appendChild(img);
        article.appendChild(div).appendChild(createFavBtn(doggie.id));
        htmlPosition.appendChild(article);

        if (i <= size) i++;
      });
    })
    .catch((err) => console.error("Error: ", err));
}

function createImage(url) {
  const img = document.createElement("img");
  img.className = "rounded h-64";
  img.src = url;
  return img;
}

function createDeleteBtn(id) {
  const btn = document.createElement("button");
  btn.className = "rounded-full bg-yellow-500 p-1 m-2";
  const btnText = document.createTextNode("Remover al doggie de favoritos");
  btn.appendChild(btnText);
  btn.onclick = () => deleteFavoriteDoggieById(id);

  return btn;
}

function createFavBtn(id) {
  const btn = document.createElement("button");
  btn.className = "fav";
  btn.innerText = "💚";
  btn.onclick = () => saveDoggie(id);
  return btn;
}

async function openModal() {
  const imgSrcEmpty =
    "https://placeholder.pics/svg/200/DEDEDE/555555/Your%20doggie%20here";

  await Swal.fire({
    title: "Select your doggie pic",
    html:
      '<img id="preview" alt="Preview doggie pic" class="mx-auto rounded h-48" src="' +
      imgSrcEmpty +
      '" /><br/>' +
      '<form id="uploadingDoggie"><input type="file" name="file1" id="file1" onchange="showPreview()" /> </form>',
  }).then((result) => {
    if (result.isConfirmed) {
      UploadDoggieFromModal();
    }
  });
}

function showPreview() {
  const form = document.getElementById("uploadingDoggie");
  const formData = new FormData(form);
  const previewImg = document.getElementById("preview");
  const imgUrl = URL.createObjectURL(formData.get("file1"));
  previewImg.src = imgUrl;
}

async function UploadDoggieFromModal() {
  const form = document.getElementById("uploadingDoggie");
  const formData = new FormData(form);
  const { data, status } = await instance.post(imageUpload, {
    file: formData,
  });
  console.log(data);
  // var options = {
  //   method: "POST",
  //   headers: { "X-API-KEY": API_KEY },
  //   body: {
  //     file: formData,
  //   },
  // };
  // const res = await fetch(Doggie_UploadImage, options);
  if (status === 200) {
    await Swal.fire({
      title: "Your doggie pic uploaded correctly",
    });
  } else {
    errorMessage(res);
  }
}

function GetSectionAndCleanBeforeShowImages(sectionId) {
  const result = document.getElementById(sectionId);
  result.innerHTML = "";
  return result;
}

getRandomDoggie();
getFavoritesDoggies();
getImageDoggie();
