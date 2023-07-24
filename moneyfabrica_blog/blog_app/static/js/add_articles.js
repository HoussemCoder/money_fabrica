// handling sections where latest and popular articles been displayed

var click_num = 0;
var latest_clicks = 0;
var popular_clicks = 0;
var liked_clicks = 0;

function load_more_articles(filter) {
    if (filter === "latest") {
        latest_clicks += 1
        click_num = latest_clicks;
    } else if (filter === "popular") {
        popular_clicks += 1
        click_num = popular_clicks;
    } else {
        liked_clicks += 1
        click_num = liked_clicks;
    }
    fetch(`load_articles/?click=${encodeURIComponent(click_num)}&filter=${encodeURIComponent(filter)}`, {
        method: "GET",
        headers: {
            'Content-Type': 'application/json',
            // 'X-CSRFToken': "{% csrf_token %}",
        },
    })
    .then(response => response.json())
    .then(data => {
        let dev_name = get_dev(filter);
        articles_container = document.querySelector(dev_name);
        if (articles_container) {
            data.articles.forEach(article => {
                let new_article;
                if (filter === "liked") {
                    new_article = create_new_banner_article(article);
                    console.log(new_article)
                } else {
                    new_article = create_new_article(article);
                }
                articles_container.appendChild(new_article);
            });
        }
        if (data.has_more === false) {
            let load_btn;
            if (filter === "latest") {
                load_btn = document.getElementById("see-more-latest");
            } else if (filter === "popular") {
                load_btn = document.getElementById("see-more-popular");
            } else {
                load_btn = document.getElementById("right-banner");
            }
            load_btn.disabled = true;
            if (filter !== "liked") {
                load_btn.style.backgroundImage = "linear-gradient(to bottom, #fafafa, #c0c0c0)";
                load_btn.textContent = "No More";
            }
        }
    })
    .catch(error => {
        console.error(`Error:`, error);
    })
}

function get_dev(filter) {
    let dev_name;
    if (filter === "latest") {
        dev_name = ".latest-articles"
    } else if (filter === "liked") {
        dev_name = ".articles-group"
    } else {
        dev_name = ".popular-articles"
    }
    return dev_name
}

function create_new_banner_article(article) {
    const articleDiv = document.createElement("a");
    articleDiv.classList.add("item");
    articleDiv.href = `http://${article.BASE_URL}/articles/${article.slug}`;
    articleDiv.target = "_blank";

    const imgElement = document.createElement('img');
    imgElement.src = `../../static/images/thumbnails/${article.thumbnail}`;
    imgElement.alt = article.title;

    const pElement = document.createElement('p');
    pElement.textContent = truncate_string(article.title, 50);

    articleDiv.appendChild(imgElement);
    articleDiv.appendChild(pElement);

    return articleDiv
}

function create_new_article(article) {
    const articleDiv = document.createElement("a");
    articleDiv.classList.add("article");
    articleDiv.href = `http://${article.BASE_URL}/articles/${article.slug}`;
    articleDiv.target = "_blank";
    
    //// using the manualy method for creating a new article block
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
    
    //// using innerHTML
    // article_div.innerHTML = `
    //     <img src="../../static/images/thumbnails/${article.thumbnail}" alt="${article.title}">
    //       <div class="text">
    //         <h3>${article.title}</h3>
    //         <time class="date"><i class="fa-solid fa-calendar-days"></i> ${article.pub_date}</time>
    //       </div>
    // `;

    return articleDiv
}

function date_formating(date) {
    const old_format = new Date(date);
    const options = {year: "numeric", month: "long", day: "numeric"};
    const new_format = old_format.toLocaleDateString("en-US", options)
    return new_format
}


function truncate_string(str, chars_num) {
    if (str.length > chars_num) {
        return str.slice(0, chars_num) + "...";
    } else {
        return str
    }
}