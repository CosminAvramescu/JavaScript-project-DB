window.onload = async function () {
    await generate2022Movies(1);
    createPagination(500);
    setPaginationButtons();
}

async function generate2022Movies(pageNumber) {
    try {
        let response = await fetch('https://api.themoviedb.org/3/discover/movie?api_key=a4f0b68d7157e9413265bd7875ece499&year=2022&page=' + pageNumber);
        let jsonResponse = JSON.parse(JSON.stringify(await response.json()));
        document.getElementById("wrapper-card-text").innerText = "2022 Movies";
        clearCards();
        for (movie of jsonResponse.results) {
            renderCards(movie)
        }
    } catch (err) {
        alert(err);
    }
}

async function generateGenres(pageNumber) {
    let response = await fetch('https://api.themoviedb.org/3/genre/movie/list?api_key=a4f0b68d7157e9413265bd7875ece499&language=en-US&page=' + pageNumber);
    let jsonResponse = JSON.parse(JSON.stringify(await response.json()));
    for (genre of jsonResponse.genres) {
        renderGenreDropdown(genre)
    }
}

function renderGenreDropdown(genre) {
    const select = document.getElementById("dd-menu")
    select.innerHTML += "<option value='" + genre.id + "'>" + genre.name + "</option><p hidden>" + genre.id + "</p>";
}

function clearCards() {
    if (document.getElementById("wrapper-card").innerHTML !== "") {
        document.getElementById("wrapper-card").innerHTML = "";
    }
}

async function generateTrendingMovies(pageNumber) {
    try {
        let response = await fetch('https://api.themoviedb.org/3/trending/all/day?api_key=a4f0b68d7157e9413265bd7875ece499&page=' + pageNumber);
        let jsonResponse = JSON.parse(JSON.stringify(await response.json()));
        clearCards();
        resetPagination()
        document.getElementById("wrapper-card-text").innerText = "Trending Movies";
        for (movie of jsonResponse.results) {
            renderCards(movie)
        }
    } catch (err) {
        alert(err);
    }
}

function renderCards(movie) {
    const cards = document.getElementById("wrapper-card")
    if (movie.poster_path != null) {
        let imgSrc = "https://image.tmdb.org/t/p/w500" + movie.poster_path
        cards.innerHTML += "<div class='card w-100 text-center m-4'><img class='card-img-top w-25 mx-auto' alt='movie-image' src='" + imgSrc + "'>" +
            "<div class='card-body'><h5 class='card-title'>" + movie.title + " " + movie.original_language + " " + movie.release_date + "</h5><article id='article1'>" + movie.overview + "</article></div>";
    } else {
        cards.innerHTML += "<div class='card w-100 text-center m-4'>" +
            "<div class='card-body'><h5 class='card-title'>" + movie.title + " " + movie.original_language + " " + movie.release_date + "</h5><article id='article1'>" + movie.overview + "</article></div>";
    }
}

async function getMoviesByGenre(genreId, genreName, pageNumber) {
    try {
        let response = await fetch('https://api.themoviedb.org/3/discover/movie?api_key=a4f0b68d7157e9413265bd7875ece499&with_genres=' + genreId + '&page=' + pageNumber);
        let jsonResponse = JSON.parse(JSON.stringify(await response.json()));
        clearCards();
        document.getElementById("wrapper-card-text").innerText = genreName + " Movies";
        for (movie of jsonResponse.results) {
            renderCards(movie)
        }
    } catch (err) {
        alert(err);
    }
}

function createPagination(totalPages) {
    if (document.getElementById("pag").innerHTML !== "") {
        document.getElementById("pag").innerHTML = "";
    }

    document.getElementById("pag").innerHTML += "<li class='page-item'><button class='page-link'>Previous</button></li>";
    document.getElementById("pag").innerHTML += "<li class='page-item active'><button class='page-link'>1</button></li>";
    for (let i = 2; i <= 5; i++) {
        document.getElementById("pag").innerHTML += "<li class='page-item'><button class='page-link'>" + i + "</button></li>";
    }
    document.getElementById("pag").innerHTML += "<li class='disabled'><button class='page-link'>...</button></li>";
    document.getElementById("pag").innerHTML += "<li class='page-item'><button class='page-link'>" + Math.round(totalPages / 2) + "</button></li>";
    document.getElementById("pag").innerHTML += "<li class='disabled'><a class='page-link'>...</a></li>";
    document.getElementById("pag").innerHTML += "<li class='page-item'><button class='page-link'>" + (totalPages - 1) + "</button></li>";
    document.getElementById("pag").innerHTML += "<li class='page-item'><button class='page-link'>" + (totalPages) + "</button></li>";
    document.getElementById("pag").innerHTML += "<li class='page-item'><button class='page-link'>Next</button></li>";
}

function setPaginationButtons() {
    let header = document.getElementById("pag");
    let btns = header.getElementsByClassName("page-item");
    for (let i = 1; i < btns.length - 1; i++) {
        btns[i].addEventListener("click", async function () {
            let current = document.getElementsByClassName("active");
            if (current.length > 0) {
                current[0].className = current[0].className.replace(" active", "");
            }
            this.className += " active";
            await nextPage(this)
        });
    }
    btns[0].addEventListener("click", async function () {
        let current = document.getElementsByClassName("active");
        if (current[0].innerText !== '1') {
            let pSibling = current[0].previousSibling;
            if (current.length > 0) {
                current[0].className = current[0].className.replace(" active", "");
            }
            pSibling.className += " active";
            await nextPage(pSibling)
        }
    });
    btns[btns.length - 1].addEventListener("click", async function () {
        let current = document.getElementsByClassName("active");
        if (current[0].innerText !== '500') {
            let nSibling = current[0].nextSibling;
            if (current.length > 0) {
                current[0].className = current[0].className.replace(" active", "");
            }
            nSibling.className += " active";
            await nextPage(nSibling)
        }
    });
}

async function nextPage(btn) {
    let apiType = document.getElementById("wrapper-card-text").innerText.split(" ")[0];
    switch (apiType) {
        case "Trending":
            await generateTrendingMovies(btn.innerText)
            break;
        case "2022":
            await generate2022Movies(btn.innerText)
            break;
        default:
            getGenreId(apiType).then(value => getMoviesByGenre(value, apiType, btn.innerText))
            break;
    }
    window.scrollTo({top: 0, behavior: 'smooth'});
}

async function getGenreId(genreName) {
    let response = await fetch('https://api.themoviedb.org/3/genre/movie/list?api_key=a4f0b68d7157e9413265bd7875ece499&language=en-US');
    let jsonResponse = JSON.parse(JSON.stringify(await response.json()));
    for (let i = 0; i < jsonResponse.genres.length; i++) {
        if (jsonResponse.genres[i].name === genreName)
            return jsonResponse.genres[i].id;
    }
}

document.getElementById("dd-menu").onchange = async function () {
    await getMoviesByGenre(document.getElementById('dd-menu').value
        , document.getElementById('dd-menu').options[document.getElementById('dd-menu').selectedIndex].text);
    resetPagination()
}

function resetPagination() {
    let current = document.getElementsByClassName("active");
    if (current.length > 0) {
        current[0].className = current[0].className.replace(" active", "");
    }
    document.querySelector("#pag :nth-child(2)").className += " active"
}

document.getElementById("dd-menu").onclick = async function () {
    await generateGenres(1)
}