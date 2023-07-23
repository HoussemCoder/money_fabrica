/* add some behaviors to the pages */


// change the direction of the how-to... arrow
function up_down(tag) {
    const arrow = document.querySelector(tag)
    
    arrow.classList.toggle("up");
}


// display articles-banner
function show_banner(banner) {
    console.log("herer")
    const banner = document.querySelector(banner);
    let last_scrollY_value = 0;
    if (window.scrollY > last_scrollY_value && window.screenY > 1000) {
        banner.style.paddingTop = 0;
    } else {
        banner.style.marginTop = "-110px";
    }
}


//add new value
function set_value(element, value) {
    const hidden_input = document.querySelector(element);

    hidden_input.value = value;
}

// hide an area by clicking
function hide_area(class_) {
    const area = document.querySelector(class_);
    const submit_btn = document.querySelector(".submit-newsletter");

    area.style.display = "none";
    submit_btn.style.display = "inline-block";
}

// hide the popups windows
function hide_window(window_) {
    const popup_window = document.querySelectorAll(window_);
    const body = document.querySelector(".overlay");
    const email_input = document.querySelector(".email-input");

    for (let window of popup_window) {
        window.style.display = "none";
    }
    body.style.display = "none";

    // if the page is the resend page
    if (email_input === null) {
        window.location.assign("/");
    }
}

// display list by clicking on its icon
function show_list(tag) {
    const nav_list = document.querySelector(tag);

    if (nav_list.style.display === 'flex') {
        nav_list.style.display = 'none';
    } else {
            nav_list.style.display = 'flex';
        }
};

// change the shape of the menu-icon when focusing
function change_shape(icon) {
    icon.classList.toggle("change");
}


// add some new styling by clicking (ex: here we talk about the nav links underline)
function add_new_style(tag, _class) {
    const page_title = document.title.split("|")[0].trim()
    const links = document.querySelectorAll(tag)
    
    links.forEach(link => link.classList.remove(_class))

    for (let link of links) {
        let text = link.textContent.trim()
        if (text === page_title) {
            link.classList.add(_class);
        }
    }
}

add_new_style('.a-header', 'active')

// display element bar by clicking on its icon
function show_search_bar(tag) {
    const element = document.querySelector(tag);

    if (element.style.bottom === '-90%') {
        element.style.bottom = '0';
        element.style.zIndex = '-99';
    } else {
        element.style.zIndex = '10';
        element.style.bottom = '-90%';
    }    
}    


// btns to move within the same page
function btn_action(element) {
    const section = document.getElementById(element);

    section.scrollIntoView({behavior: 'smooth'});
};


// hide or show some elements depending on others
function show_if(btn, sec) {
    const button = document.getElementById(btn);
    const section = document.getElementById(sec);
    
    if (section.getBoundingClientRect().bottom <= window.innerHeight) {
        button.style.display = "block";
    } else {
        button.style.display = "none";
    }
};


// hide or show some elements depending on the height of the page
function show_when(tag) {
    const element = document.getElementById(tag);

    if (window.scrollY >= window.innerHeight * 1.1) {
        element.style.display = "block";
    } else {
        element.style.display = "none";
    }
}


// display every section nicely when scroll down to it
function nice_show(old_style, new_style) {
    const element = document.querySelector(old_style);
    
    if (element !== null && element !== undefined) {
        const threshold = window.innerHeight * 0.8;
        
        if (element.getBoundingClientRect().top <= threshold) {
            old_style = old_style.slice(1);
            element.classList.add(new_style);
            element.classList.remove(old_style);
        }
    }
}


// add social media sharing urls
function share_on_fb(event, slug) {
    event.preventDefault();
    var article_url = encodeURIComponent("https://www.moneyfabrica.com/" + slug);
    var share_url = "https://www.facebook.com/sharer/sharer.php?u=" + article_url;
    window.open(share_url, "_blank", "width=500, height=600");
}

function share_on_pin(event, slug, title, img) {
    event.preventDefault();
    var article_url = encodeURIComponent("https://www.moneyfabrica.com/" + slug);
    var article_img = "https://www.moneyfabrica.com/static/images/thumbnails/" + img;
    var share_url = "https://www.pinterest.com/pin/create/button/?url=" + article_url + "&media=" + article_img + "&description=" + title;
    window.open(share_url, "_blank", "width=500, height=600");
}

function share_on_in(event, slug, title) {
    event.preventDefault();
    var article_url = encodeURIComponent("https://www.moneyfabrica.com/" + slug);
    var share_url = "https://www.linkedin.com/shareArticle?url=" + article_url + "&title=" + title + "&summary=";
    window.open(share_url, "_blank", "width=500, height=600");
}

function share_on_tw(event, slug, title) {
    event.preventDefault();
    var article_url = encodeURIComponent("https://www.moneyfabrica.com/" + slug);
    var share_url = "https://twitter.com/intent/tweet?url=" + article_url + "&text=" + title;
    window.open(share_url, "_blank", "width=500, height=600");
}


