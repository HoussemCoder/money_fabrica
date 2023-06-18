/* add some behaviors to the pages */


// hide the 'success subscruption window'
function hide_window(window) {
    const success_window = document.querySelector(window);
    const body = document.querySelector(".overlay");

    success_window.style.display = "none";
    body.style.display = "none";
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


// change the direction of the how-to... arrow
function up_down(tag) {
    const arrow = document.querySelector(tag)
    
    arrow.classList.toggle("up");
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


// add or set new properties for a specific element
function set_properties(tag, styles) {
    const element = document.querySelector(tag);
    
    for (let property in styles) {
        element.style[property] = styles[property];
    }    
};    


// to add a new class to an existing html element
function add_class(clicked_tag, main_tag, class_name) {
    const clicked_element = document.querySelector(clicked_tag);
    const main_element = document.querySelector(main_tag);

    clicked_element.addEventListener('click', () => {
        if (!(main_element.classList.contains(class_name))) {
            main_element.classList.add(class_name);
        }
    })

}




