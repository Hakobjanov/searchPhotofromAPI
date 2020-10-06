const auth = "563492ad6f91700001000001243a5ca56f884010acebb074a6d49b75";
const gallery = document.querySelector(".gallery");
const searchInput = document.querySelector(".search-input");
const form = document.querySelector(".search-form");
const more = document.querySelector(".more");
const toTheTopBtn = document.querySelector(".up");
let searchValue;
let page = 1;
let fetchLink;
let currentSearch;

//up button
toTheTopBtn.addEventListener("click", () => scrollTo(0, 0));

//event listener
searchInput.addEventListener("input", updateInput);
form.addEventListener("submit", (e) => {
  e.preventDefault();
  currentSearch = searchValue;
  searchPhotos(searchValue);
});

more.addEventListener("click", loadMore);

function updateInput(e) {
  searchValue = e.target.value;
}

async function fetchAPI(url) {
  const dataFetch = await fetch(url, {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: auth,
    },
  });
  const data = await dataFetch.json();
  return data;
}

function generatePictures(data) {
  data.photos.forEach((photo) => {
    const galleryImg = document.createElement("div");
    galleryImg.classList.add("gallery-img");
    galleryImg.innerHTML = ` 
    <div class="gallery-info">
          <p >${photo.photographer}</p>
          <a  href=${photo.src.original}>Download</a>
          </div>
          <img src=${photo.src.large}> </img>
          `;
    gallery.appendChild(galleryImg);
  });
}

async function curatedPhotos() {
  fetchLink = "https://api.pexels.com/v1/curated?per_page=15&page=1";
  const data = await fetchAPI(fetchLink);
  generatePictures(data);
}

async function searchPhotos(search) {
  clear();
  fetchLink = `https://api.pexels.com/v1/search?query=${search}+query&per_page=15&page=1`;
  const data = await fetchAPI(fetchLink);
  console.log(data);
  if (data.total_results) {
    generatePictures(data);
  } else {
    const noResult = document.createElement("h3");
    noResult.classList.add("no-result");
    noResult.innerText = "No Photos";
    gallery.appendChild(noResult);
  }
}

function clear() {
  gallery.innerHTML = "";
  searchInput.value = "";
}

async function loadMore() {
  this.blur();

  page++;
  if (currentSearch) {
    fetchLink = `https://api.pexels.com/v1/search?query=${currentSearch}+query&per_page=15&page=${page}`;
  } else {
    fetchLink = `https://api.pexels.com/v1/curated?per_page=15&page=${page}`;
  }
  const data = await fetchAPI(fetchLink);
  generatePictures(data);
}

curatedPhotos();
