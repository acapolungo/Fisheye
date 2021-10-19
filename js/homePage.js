

/* ============================= import des données ============================= */

//import des data JSon, de la classe Photographe et des fonctions
import { getData } from './data.js';
import { Photograph } from './photograph_class.js';
import { getScrollPosition } from './fonctions.js';

/* ============================= Générer les photographes  ============================= */

// function createPhotograph(data) {
//     const dataPhoto = data.photographers;
//     dataPhoto.forEach(element => {
//         let photograph = new Photograph(
//             element.name,
//             element.id,
//             element.city,
//             element.country,
//             element.tags,
//             element.tagline,
//             element.price,
//             element.portrait
//         );
//         arrayPhotograph.push(photograph);
//     });
// }

function photographers(photographersData) {
    //console.log(photographers)
    return photographersData.map( photographerData => new Photograph(photographerData));
}

/* ============================= Render de la classe photographe ============================= */

// on concatène les photographes et on les affiches
function displayPhotographersHome(allPhotographers) {
    if (allPhotographers.length > 0) {
        const photographersHtml = allPhotographers.map(photograph => photograph.templateRender()).join("");
        const main = document.querySelector('.home');

        main.innerHTML = photographersHtml;
    }
}

/* ============================= Render de la liste de tag des photographes ============================= */

// on créer les tags globaux à partir d'un Set de tags
const uniqTags = function (array) {
    const tagsSet = new Set;
    const concatTags = array.map(photograph => photograph.tags).flat();
    concatTags.forEach(tag => {
        tagsSet.add(tag);
    });
    const uniqueTags = [...tagsSet].sort();
    return uniqueTags;
}

/* ============================= Render des tags globaux ============================= */

// on concatène les tags globaux et on les affiches triés
function displayUniqTags(allPhotographers) {
    const category = document.querySelector('.header__category');

    const tagsHtml = uniqTags(allPhotographers).map(tag => `<a href="#" class="header__tags">${tag}</a>`).join('');
    category.innerHTML = tagsHtml;

    const headerTags = document.querySelectorAll('.header__tags');
    headerTags.forEach(tag => tag.addEventListener('click', (e) => showPhotographersTagged(e, allPhotographers)));
}

/* ============================= Gestion du style des tags ============================= */
const selectedTagsSet = new Set();
function showPhotographersTagged(e, allPhotographers) {
    // Au clic ajoute la classe active si elle n'existe pas
    e.target.classList.toggle('active')

    // stock dans un set les elements cliqués
    const targetedTag = e.target.text;  
    if (selectedTagsSet.has(targetedTag)) {
        selectedTagsSet.delete(targetedTag);
    } 
    else {
        selectedTagsSet.add(targetedTag);
    }
    // on transforme le set en tableau
    const selectedTagsArray = [...selectedTagsSet];

    // on vide le tableau dynamicPhotographs et on retourne les photographes qui possèdent un tag correspondant
    const taggedPhotographers = allPhotographers.filter(photograph => photograph.hasTags(selectedTagsArray));
    taggedPhotographers.length === 0 ? displayPhotographersHome(allPhotographers) : displayPhotographersHome(taggedPhotographers);
}

/* ============================= Charge la page et créer les photographes et les tags globaux ============================= */

const main = function () {
    window.addEventListener('scroll', getScrollPosition);
    getData().then(({photographers: photographersData}) => {
        const allPhotographers = photographers(photographersData);

        displayPhotographersHome(allPhotographers);
        displayUniqTags(allPhotographers);
    });
}

main();