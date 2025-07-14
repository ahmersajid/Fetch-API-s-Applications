let getSearch = document.querySelector('#search');
let getdiv = document.querySelector('#content');

window.onload = function () {
    fetch(`https://newsdata.io/api/1/latest?apikey=pub_d52df2dd167944269337ac296f6ffb05&q=US%20Election&prioritydomain=top`)
        .then((data) => {
            return data.json();
        })
        .then((data) => {
            console.log(data);
            getdiv.innerHTML = '';
            if (data.results && data.results.length > 0) {
                data.results.slice(0, 9).forEach((el) => {
                    const imageUrl = el.image_url || 'https://via.placeholder.com/300x200?text=No+Image';
                    getdiv.innerHTML += `
                        <div class="card m-5" style="width: 18rem;" id="Cards">
                            <img src="${imageUrl}" class="card-img-top m-2" alt="${el.title || 'News image'}">
                            <div class="card-body">
                                <h5 class="card-title" id="heading-color">${el.creator || 'Unknown author'}</h5>
                                <p class="card-text" id="text-color">${el.description || 'No description available'}</p>
                                <a href="${el.link}" target="_blank" class="btn btn-primary">Read more</a>
                            </div>
                        </div>`;
                });
            } else {
                getdiv.innerHTML = '<p class="text-center">No news articles found.</p>';
            }
        })
        .catch((err) => {
            console.log(err);
            getdiv.innerHTML = '<p class="text-center">Failed to load news. Please try again later.</p>';
        });
};

function Search() {
    const searchTerm = getSearch.value.trim();
    if (!searchTerm) {
        Swal.fire({
            title: "Hello Sir/Madam",
            text: "Please Enter some Text",
            icon: "question"
        });
        return;
    }

    fetch(`https://newsdata.io/api/1/latest?apikey=pub_d52df2dd167944269337ac296f6ffb05&q=${getSearch.value}&prioritydomain=top`)
        .then((data) => {
            return data.json();
        })
        .then((data) => {
            console.log(data);
            getdiv.innerHTML = '';
            if (data.results && data.results.length > 0) {
                data.results.slice(0, 9).forEach((el) => {
                    const imageUrl = el.image_url || 'https://via.placeholder.com/300x200?text=No+Image';
                    getdiv.innerHTML += `
                        <div class="card m-5" style="width: 18rem;" id="Cards">
                            <img src="${imageUrl}" class="card-img-top m-2" alt="${el.title || 'News image'}">
                            <div class="card-body">
                                <h5 class="card-title">${el.creator || 'Unknown author'}</h5>
                                <p class="card-text">${el.description || 'No description available'}</p>
                                <a href="${el.link}" target="_blank" class="btn btn-primary">Read more</a>
                            </div>
                        </div>`;
                });
            } else {
                getdiv.innerHTML = '<p class="text-center">No results found for your search.</p>';
            }
        })
        .catch((err) => {
            console.log(err);
            getdiv.innerHTML = '<p class="text-center">Failed to search. Please try again later.</p>';
        });

    getSearch.value = "";
}


