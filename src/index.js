import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import axios from 'axios';
import Notiflix from 'notiflix';
import '@fortawesome/fontawesome-free/css/all.css';

const form = document.getElementById('search-form');
const gallery = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');
const apiKey = '28572432-d9bfef10324799b9b4a4c6d39';
let page = 1;
let totalImages = 0;
let currentTotalHits = 0;
let hoorayNotified = false;

document.addEventListener('DOMContentLoaded', async () => {
  loadMoreBtn.style.display = 'none';

  form.addEventListener('submit', async event => {
    event.preventDefault();
   
    const searchQuery = form.elements.searchQuery.value.trim();
    if (searchQuery !== '') {   
        
      try {
        gallery.innerHTML = '';
        page = 1;
        const response = await axios.get('https://pixabay.com/api/', {
          params: {
            key: apiKey,
            q: searchQuery,
            image_type: 'photo',
            orientation: 'horizontal',
            safesearch: true,
            per_page: 40,
            page: page,
          },
        });

        const { data } = response;
        const images = data.hits;
        currentTotalHits = data.totalHits;

        if (images.length > 0) {
          if (page === 1) {
            hoorayNotified = false;
          }

          
          images.forEach(image => {
            const card = document.createElement('div');
            card.classList.add('photo-card');
            card.innerHTML = `   
                <a href="${image.largeImageURL}" class="lightbox">
                <img class="gallery-image" src="${image.webformatURL}" alt="${image.tags}" loading="lazy" />
                <div class="info">
                  <p class="info-item">
                  
                  <i class="fas fa-heart"><span class="fa-p">${image.likes}</span></i>
                  </p>
                  <p class="info-item">
                  <i class="fas fa-eye"><span class="fa-p">${image.views}</span></i> 
                  </p>
                  <p class="info-item">
                  <i class="fas fa-comment"><span class="fa-p">${image.comments}</span></i> 
                  </p>
                  <p class="info-item">
                  <i class="fas fa-download"><span class="fa-p">${image.downloads}</span></i> 
                  </p>
                </div>
                 </a>
              </div>
             
                `;
            gallery.appendChild(card);
          });

          totalImages += images.length;

          if (totalImages >= currentTotalHits) {
            loadMoreBtn.style.display = 'none';
          
              Notiflix.Notify.warning("We're sorry, but you've reached the end of search results.");
            
          } else {
            if (!hoorayNotified) {
                Notiflix.Notify.success(`Hooray! We found ${currentTotalHits} images.`);
                hoorayNotified = true; 
              }
            loadMoreBtn.style.display = 'block';
            }
        
          page += 1;
        } else {
            loadMoreBtn.style.display = 'none';
          Notiflix.Notify.warning(
            'Sorry, there are no images matching your search query. Please try again.'
          );
        }
      } catch (error) {
        console.error(error);
        Notiflix.Notify.failure(
          'An error occurred while fetching images. Please try again.'
        );
      }
    } else {
      Notiflix.Notify.warning('Please enter a search query.');
    }
  });

  loadMoreBtn.addEventListener('click', async () => {
    try {
      const searchQuery = form.elements.searchQuery.value.trim();

      const response = await axios.get('https://pixabay.com/api/', {
        params: {
          key: apiKey,
          q: searchQuery,
          image_type: 'photo',
          orientation: 'horizontal',
          safesearch: true,
          per_page: 40,
          page: page,
        },
      });

      const { data } = response;
      const images = data.hits;
      currentTotalHits = data.totalHits;

      if (images.length > 0) {
        images.forEach(image => {
          const card = document.createElement('div');
          card.classList.add('photo-card');
          card.innerHTML = `   
          <a href="${image.largeImageURL}" class="lightbox">
          <img class="gallery-image" src="${image.webformatURL}" alt="${image.tags}" loading="lazy" />
          <div class="info">
            <p class="info-item">
            
            <i class="fas fa-heart"><span class="fa-p">${image.likes}</span></i>
            </p>
            <p class="info-item">
            <i class="fas fa-eye"><span class="fa-p">${image.views}</span></i> 
            </p>
            <p class="info-item">
            <i class="fas fa-comment"><span class="fa-p">${image.comments}</span></i> 
            </p>
            <p class="info-item">
            <i class="fas fa-download"><span class="fa-p">${image.downloads}</span></i> 
            </p>
          </div>
           </a>
          </div>`;
          gallery.appendChild(card);
        });

        totalImages += images.length;

        if (totalImages >= currentTotalHits) {
          loadMoreBtn.style.display = 'none';
          Notiflix.Notify.warning("We're sorry, but you've reached the end of search results.");
        }

        page += 1;
      } else {
        loadMoreBtn.style.display = 'none';
        Notiflix.Notify.warning('No more images to load.');
      }
    } catch (error) {
      console.error(error);
      Notiflix.Notify.failure('An error occurred while fetching more images. Please try again.');
    }
  });

const lightbox = new SimpleLightbox('.gallery-image', {
    captionsData: 'alt',
    captionDelay: 250,
    elements: '.gallery-image',
    close: true,
  });

  gallery.addEventListener('click', event => {
    if (event.target.classList.contains('gallery-image')) {
      event.preventDefault();
      lightbox.open();
    }
  });
});
