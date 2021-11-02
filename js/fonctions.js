
/* ============================= Bouton au scroll ============================= */
export function getScrollPosition() {
    let scrollObject = {};
    const button = document.querySelector('.header__mainlink');
    scrollObject = {
        x: window.scrollX,
        y: window.scrollY
    }
    function moveToTop() {
        window.scrollTo(0, 1000);
    };

    // If you want to check distance
    if (scrollObject.y > 200) {
        // add class
        button.classList.add('header__mainlink--reveal');
        button.addEventListener('click', moveToTop);
    } else {
        // remove class
        button.classList.remove('header__mainlink--reveal');
        button.removeEventListener('click', moveToTop);
    }
}

/* ============================= Récupérer l'url ============================= */

export const getUrlParameter = function getUrlParameter(sParam) {
    let sPageURL = window.location.search.substring(1),
        sURLVariables = sPageURL.split('&'),
        sParameterName,
        i;

    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');

        if (sParameterName[0] === sParam) {
            return typeof sParameterName[1] === undefined ? true : decodeURIComponent(sParameterName[1]);
        }
    }
    return false; // for empty search
};