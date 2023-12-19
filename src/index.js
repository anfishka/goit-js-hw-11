import axios from 'axios';
import Notiflix from 'notiflix';
import '@fortawesome/fontawesome-free/css/all.css';


const form = document.getElementById('search-form');
const gallery = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');
const apiKey = '28572432-d9bfef10324799b9b4a4c6d39';
let page = 1;

form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const searchQuery = form.elements.searchQuery.value.trim();

    if(searchQuery !== '') {
        try {
            const response = await axios.get('https://pixabay.com/api/', {
                params: {
                    key: apiKey,
                    q: searchQuery,
                    image_type: 'photo',
                    orientation:'horizontal',
                    safesearch: true,
                    per_page: 40,
                    page: page,
                },
        });

        const {data} = response;
        const images = data.hits;

        if(images.length > 0){
            if(page == 1) {
                gallery.innerHTML = '';
            }

            images.forEach((image) => {
                const card = document.createElement('div');
                card.classList.add('photo-card');
                card.innerHTML = `
                
                
                <div class="photo-card gallery__item">
                <a href="${image.largeImageURL}" class="lightbox">
                <img src="${image.webformatURL}" alt="${image.tags}" loading="lazy" />
                <div class="info">
                  <p class="info-item">
                  <i class="fas fa-heart"></i> + ${image.likes}
                  </p>
                  <p class="info-item">
                  <i class="fas fa-eye"></i> ${image.views}
                  </p>
                  <p class="info-item">
                  <i class="fas fa-comment"></i> ${image.comments}
                  </p>
                  <p class="info-item">
                  <i class="fas fa-download"></i> ${image.downloads}
                  </p>
                </div>
                 </a>
              </div>
             
                `;
                gallery.appendChild(card);       
            });

            loadMoreBtn.style.display = 'block';

            page += 1;
        } else {
            Notiflix.Notify.warning("Sorry, there are no images matching your search query. Please try again.");
        }
    } catch (error) {
        console.error(error);
        Notiflix.Notify.failure("An error occurred while fetching images. Please try again.");
    }
}else {
    Notiflix.Notify.warning("Please enter a search query.");
}
});

loadMoreBtn.addEventListener('click', () => {
form.dispatchEvent(new Event('submit'));
});
