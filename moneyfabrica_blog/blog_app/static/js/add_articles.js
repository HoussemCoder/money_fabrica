// handling sections where latest and popular articles been displayed

var click_num = 0;
var latest_clicks = 0;
var popular_clicks = 0;


function load_more_articles(filter) {
    fetch(`load_articles/?click=${encodeURIComponent(click_num)}&filter=${encodeURIComponent(filter)}`, {
        method: "GET",
        headers: {
            'Content-Type': 'application/json',
            // 'X-CSRFToken': "{% csrf_token %}",
        },
    })
    .then(response => response.json())
    .then(data => {
        let dev_name;
        if (filter === "latest") {dev_name = ".latest-articles"} else {dev_name = ".popular-articles"};
        articles_container = document.querySelector(dev_name);
        if (articles_container) {
            data.articles.forEach(article => {
                new_article = create_new_article(article);
                articles_container.appendChild(new_article);
            });
        }
        if (data.has_more === false) {
            let load_btn;
            if (filter === "latest") {
                load_btn = document.getElementById("see-more-latest");
            } else {
                load_btn = document.getElementById("see-more-popular");
            }
            load_btn.disabled = true;
            load_btn.style.display = "none";
        }
        if (filter === "latest") {
            latest_clicks += 1
            click_num = latest_clicks;
        } else {
            popular_clicks += 1
            click_num = popular_clicks;
        }
        console.log(latest_clicks, popular_clicks, click_num)
    })
    .catch(error => {
        console.error(`Error:`, error);
    })
}

function create_new_article(article) {
    const articleDiv = document.createElement("a");
    articleDiv.classList.add("article");
    articleDiv.href = `http://${article.BASE_URL}/articles/${article.slug}`;
    articleDiv.target = "_blank";
    //// using innerHTML
    // article_div.innerHTML = `
    //     <img src="../../static/images/thumbnails/${article.thumbnail}" alt="${article.title}">
    //       <div class="text">
    //         <h3>${article.title}</h3>
    //         <time class="date"><i class="fa-solid fa-calendar-days"></i> ${article.pub_date}</time>
    //       </div>
    // `;
    //// using the manualy method
    const imgElement = document.createElement('img');
    imgElement.src = `../../static/images/thumbnails/${article.thumbnail}`;
    imgElement.alt = article.title;
    const textDiv = document.createElement('div');
    textDiv.classList.add("text");
    const h3Element = document.createElement('h3');
    h3Element.textContent = article.title;
    const timeElement = document.createElement('time');
    const iconElement = document.createElement("i");
    iconElement.classList.add("fa-solid", "fa-calendar-days");
    
    const article_pub_date = date_formating(article.pub_date);
    const pubDateTextNode = document.createTextNode(` ${article_pub_date}`);
    timeElement.appendChild(pubDateTextNode);
    timeElement.insertBefore(iconElement, pubDateTextNode)

    textDiv.appendChild(h3Element);
    textDiv.appendChild(timeElement);

    articleDiv.appendChild(imgElement);
    articleDiv.appendChild(textDiv);

    return articleDiv
}

function date_formating(date) {
    const old_format = new Date(date);
    const options = {year: "numeric", month: "long", day: "numeric"};
    const new_format = old_format.toLocaleDateString("en-US", options)
    return new_format
}
