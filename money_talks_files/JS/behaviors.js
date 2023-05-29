/* add some behaviors to the pages */


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
function change_icon_shape(icon) {
    icon.classList.toggle("change");
}


// display element bar by clicking on its icon
function show_search_bar(tag) {
    const element = document.querySelector(tag);

    if (element.style.bottom === '-100%') {
        element.style.bottom = '0';
        element.style.zIndex = '-99';
    } else {
        element.style.zIndex = '10';
        element.style.bottom = '-100%';
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




