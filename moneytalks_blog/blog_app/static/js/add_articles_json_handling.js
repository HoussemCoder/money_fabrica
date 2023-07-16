// handling sections where latest and popular articles been displayed

// JavaScript code

// Function to handle the button click event
function loadMoreArticles() {
    // Make an AJAX request to retrieve more articles
    // Replace '/get-more-articles/' with the URL of your Django view or API endpoint
    fetch('/get-more-articles/')
      .then(response => response.json())
      .then(data => {
        // Process the response data and append the new articles to the existing list
        const articlesContainer = document.getElementById('articles-container');
        data.articles.forEach(article => {
          const articleElement = createArticleElement(article);
          articlesContainer.appendChild(articleElement);
        });
  
        // Disable or hide the load more button if there are no more articles
        if (data.has_more === false) {
          const loadMoreButton = document.getElementById('load-more-button');
          loadMoreButton.disabled = true;
          loadMoreButton.style.display = 'none';
        }
      })
      .catch(error => {
        console.error('Error:', error);
      });
  }
  
  // Function to create an article element
  function createArticleElement(article) {
    // Create the article element using the provided data
    const articleElement = document.createElement('div');
    articleElement.classList.add('article');
    articleElement.innerHTML = `
      <h2>${article.title}</h2>
      <p>${article.content}</p>
    `;
  
    return articleElement;
  }
  
  // Attach the loadMoreArticles function to the button's click event
  const loadMoreButton = document.getElementById('load-more-button');
  loadMoreButton.addEventListener('click', loadMoreArticles);
  