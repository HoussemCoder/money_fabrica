// handling sections where latest and popular articles been displayed

let click_num = 1

function load_more_articles(filter) {
    fetch(`load_articles/?click=${encodeURIComponent(click_num)}&filter=${encodeURIComponent(filter)}`, {
        method: "POST",
        headers: {
            "X-CSRFToken": "{{ csrf_token }}"
        }
    })
    .then(response => response.json())
    .then(data => {
        let dev_name;
        if (filter === "latest") {dev_name = "latest-articles"} else {dev_name = "popular-articles"};
        articles_container = document.querySelector(dev_name);
        if (articles_container) {
            data.articles.forEach(article => {
                new_article = create_new_article(article);
                articles_container.appendChild(new_article);
            });
        }
        if (data.has_more === false) {
            const load_btn = document.getElementById("see-more");
            load_btn.disabled = true;
            load_btn.style.display = "none";
        }
        click_num += 1;
    })
    .catch(error => {
        console.error("Error" = error);
    })
}

function create_new_article(article) {
    const article_div = document.createElement("a");
    article_div.classList.add("article");
    article_div.href = `{% url 'article_page' keyword=${article.slug} %}`;
    article_div.target = "_blank";
    article_div.textContent = `
        <img src="../../static/images/thumbnails/{{${article.thumbnail}}}" alt="{{${article.title}}}">
            <div class="text">
              <h3>{{${article.title}}}</h3>
              <time class="date"><i class="fa-solid fa-calendar-days"></i> {{${article.pub_date}}}</time>
            </div>
    `;
    return article_div
}
