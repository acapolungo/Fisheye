
// Fonction qui espionne le scroll et fait aparaitre le bouton
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

export function wrapperSelect() {
    const wrapper = document.querySelector('.selectcontainer')
    wrapper.addEventListener('click', function(e) {
        this.querySelector('.select').classList.toggle('open');
    })
    
    // eleve et remet le classe selected au clic, remplace la valeur du span de selection
    for (const option of document.querySelectorAll(".select__opt")) {
        option.addEventListener('click', function() {
            if (!this.classList.contains('selected')) {
                this.parentNode.querySelector('.select__opt.selected').classList.remove('selected');
                this.classList.add('selected');
                this.closest('.select').querySelector('.select__trigger span').textContent = this.textContent;
            }
        })
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
