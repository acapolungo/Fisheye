
import { Photograph } from '../js/photograph_class.js';
import { MediaFactory, Photo, Video } from './factory_class.js';
import { LightBox } from '../js/lightbox_class.js';
import { getData } from '../js/data.js';
import { modalManagement } from './modal_contact.js';
import { wrapperSelect, getUrlParameter } from '../js/fonctions.js';
import { onOpenLightBox, onCloseLightbox, onOpenModal, onCloseModal } from '../js/app.js';

/* ============================= Récupérer le photographe lié à cet ID ============================= */

function findPhotographer(photographersData, photographerId) {
    const photographerData = photographersData.find(photographer => photographer.id === photographerId);

    return new Photograph(photographerData);
}

/* ============================= Générer les Medias  ============================= */
/*
function isVideo(mediumData) {
    return mediumData.video !== undefined;
}
function isPhoto(mediumData) {
    return mediumData.image !== undefined;
}

// collection de vidéo et de photos
function createAllMedia(mediaData) {
    //console.log(mediaData)
    return mediaData.map(mediumData => {
        let medium;

        if (isVideo(mediumData)) {
            medium = new Video(mediumData)
        } else if (isPhoto(mediumData)) {
            medium = new Photo(mediumData)
        }
        return medium;
    })
}
*/

// Gestion de la factoryMedia filtré selon l'iD photographe
function photographerMedia(mediaData, photographer) {
    const photographersMediaData = mediaData.filter(mediumData => mediumData.photographerId === photographer.id);
    const photographersMedia = photographersMediaData.map(mediumData => MediaFactory.createMedium(mediumData))
    return photographersMedia;
}

/* ============================= Tri des Medias aux tags ============================= */

function sortByLikes(selectedMedia) {
    return selectedMedia.sort((a, b) => {
        return b.likes - a.likes;
    });
}

function sortByDate(selectedMedia) {
    return selectedMedia.sort((a, b) => {
        let dateA = new Date(a.date);
        let dateB = new Date(b.date);
        return dateB - dateA;
    });
    // return selectedMedia.sort((a,b) => {
    //     new Date(a.date) - new Date(b.date);
    // });
}

function sortByTitle(selectedMedia) {
    return selectedMedia.sort((a, b) => {
        let stringA = a.title.toLowerCase();
        let stringB = b.title.toLowerCase();
        if (stringA < stringB) { return -1; }
        if (stringA > stringB) { return 1; }
        return 0;
    });
}

function mediaSelectedHtml(selectedMedia, selectedPhotographer) {
    for (const option of document.querySelectorAll(".select__options")) {
        option.addEventListener('click', function (e) {
            let selectedDataValue = e.target.getAttribute('data-value');
            let sortedMedia;
            if (selectedDataValue === 'Likes') {
                sortedMedia = sortByLikes(selectedMedia);
            }
            else if (selectedDataValue === 'Date') {
                sortedMedia = sortByDate(selectedMedia);
            }
            else if (selectedDataValue === 'Title') {
                sortedMedia = sortByTitle(selectedMedia);
            }

            const sortedMediaHtml = sortedMedia.map(medium => medium.render(selectedPhotographer)).join(' ');

            document.querySelector('.gallerycontainer').innerHTML = sortedMediaHtml;
        });
    }
}

/* ============================= Rendu des Medias ============================= */

function photographerMediaHtml(selectedMedia, selectedPhotographer) {
    //console.log(selectedMedia);
    return selectedMedia.map(medium => medium.render(selectedPhotographer)).join(' ');
}

/* ============================= Likes totaux du photographe ============================= */

function photographerLikesSum(selectedMedia) {
    let sumLikes = 0;
    for (const numberOfLikes of selectedMedia) {
        sumLikes += numberOfLikes.likes;
    }
    return sumLikes;
    //return selectedMedia.reduce((previousMedia , currentMedia) => previousMedia.likes + currentMedia.likes);
}

/* ============================= Incrémenter les médias ============================= */

function incrementTargetMedia(targetGalleryLike, selectedMedia) {
    let getMediaId = targetGalleryLike.closest("section").getAttribute("media-id");
    //console.log(getMediaId)
    let currentMedia = selectedMedia.find(e => e.id == getMediaId);
    let heartIcon = targetGalleryLike.childNodes[3];
    heartIcon.classList.toggle('gallery__heart--activ');
    heartIcon.classList.contains('gallery__heart--activ') ? currentMedia.likes++ : currentMedia.likes--;
    targetGalleryLike.childNodes[1].innerHTML = currentMedia.likes;
}

function incrementSumLikes(photographLikesContainer, selectedMedia) {
    let sumLikescontainer = photographLikesContainer.childNodes[1].firstElementChild;
    sumLikescontainer.innerHTML = photographerLikesSum(selectedMedia);
}

/* ============================= Gestion de la galerie Home ============================= */

function galleryManagement(galleryContainer, selectedMedia, photographLikesContainer, selectedPhotographer) {
    galleryContainer.addEventListener('click', e => {
        // variable pour empecher l'ouverture de la lightbox sur le clic du like
        let lightBoxIsClosed = true;
        let getcurrentMediaId = e.target.closest('section').getAttribute('media-id');
        let targetGalleryLike = e.target.closest('div.gallery__like');
        if (e.target.classList.contains("gallery__content") || e.target.classList.contains("gallery__txt")) {
            return
        }
        if (lightBoxIsClosed && targetGalleryLike !== null) {
            //do something
            incrementTargetMedia(targetGalleryLike, selectedMedia);
            incrementSumLikes(photographLikesContainer, selectedMedia);
            lightBoxIsClosed = false;
        }
        if (lightBoxIsClosed && getcurrentMediaId !== null) {
            createLightBox(selectedMedia, getcurrentMediaId, selectedPhotographer, lightBoxIsClosed);
            trapFocus(lightBoxContainer);
            lightBoxIsClosed = false;
        }
    });
}

/* ============================= gestion de la lightBox ============================= */

let mediaLightbox = null;
let lastIndexSelected = -1;
let previousActiveElement;

// Constante des conteneurs et des boutons de la lightbox et modal
const arrowLeft = document.querySelector('.lightbox__arrow--left');
const arrowRight = document.querySelector('.lightbox__arrow--right');
const mainWrapper = document.querySelector('.mainpage');
const lightBoxContainer = document.querySelector('.lightboxcontainer');
const photographModalContainer = document.querySelector('.modalcontainer');
const btnCloseLightBox = document.querySelector('.lightbox__btnclose');
const selectContainer = document.querySelectorAll('.select__options');
console.log(selectContainer)

function createLightBox(selectedMedia, getcurrentMediaId, selectedPhotographer) {
    onOpenLightBox(mainWrapper, lightBoxContainer, btnCloseLightBox);

    // test pour savoir comparer deux Id selectionné et refaire la lightBox;
    if (mediaLightbox === null || lastIndexSelected != getcurrentMediaId) {
        mediaLightbox = new LightBox(selectedMedia, getcurrentMediaId, selectedPhotographer);
    }

    let lightboxContent = document.querySelector('.lightbox__content');
    lightboxContent.innerHTML = lightBoxRenderHtml(mediaLightbox, selectedPhotographer);

    arrowLeft.addEventListener('click', previousElement);
    arrowRight.addEventListener('click', nextElement);

    closeLightbox(mainWrapper, lightBoxContainer);
}
function previousElement() {
    mediaLightbox.previousMedia();
    document.querySelector('.lightbox__content').innerHTML = lightBoxRenderHtml(mediaLightbox);
}
function nextElement() {
    mediaLightbox.nextMedia();
    document.querySelector('.lightbox__content').innerHTML = lightBoxRenderHtml(mediaLightbox);
}
function lightBoxRenderHtml(mediaLightbox) {
    lastIndexSelected = mediaLightbox.getLastMediaId();
    //console.log(lastIndexSelected)
    return mediaLightbox.render();
}

// Close modal au click
function closeLightbox() {
    const btnCloseLightBox = document.querySelector('.lightbox__btnclose');
    btnCloseLightBox.addEventListener('click', function () {
        arrowLeft.removeEventListener('click', previousElement);
        arrowRight.removeEventListener('click', nextElement);

        onCloseLightbox(mainWrapper, lightBoxContainer);
    });
}

/* ============================= gestion des evenements key ============================= */

document.addEventListener('keydown', e => {
    let keyCode;

    if (e.key !== undefined) {
        keyCode = e.key;
    }
    if (lightBoxContainer.getAttribute('aria-hidden') === 'false' && keyCode === 'Escape') {
        onCloseLightbox(mainWrapper, lightBoxContainer);
    }
    if (lightBoxContainer.getAttribute('aria-hidden') === 'false' && keyCode === 'ArrowLeft') {
        previousElement();
    }
    if (lightBoxContainer.getAttribute('aria-hidden') === 'false' && keyCode === 'ArrowRight') {
        nextElement();
    }
    if (photographModalContainer.getAttribute('aria-hidden') === 'false' && keyCode === 'Escape') {
        onCloseModal(mainWrapper, photographModalContainer);
    }
    if (keyCode !== 'ArrowDown' && keyCode !== 'ArrowUp') return
    e.preventDefault()
    const option = e.target
  
    let selectedOption
    if (keyCode === 'ArrowDown') selectedOption = option.nextElementSibling
    if (keyCode === 'ArrowUp') selectedOption = option.previousElementSibling
  
    if (selectedOption) {
      selectedOption.focus();
      selectContainer.forEach(element => { console.log(element) })
      selectedOption.setAttribute('tabindex', 0);
    }
});

// function trapFocus(element) {
//     let focusableEls = element.querySelectorAll('div:not([disabled]), a[href]:not([disabled]), button:not([disabled]), textarea:not([disabled]), input[type="text"]:not([disabled]), input[type="radio"]:not([disabled]), input[type="checkbox"]:not([disabled]), select:not([disabled])');
//     let firstFocusableEl = focusableEls[0];
//     console.log(firstFocusableEl)
//     let lastFocusableEl = focusableEls[focusableEls.length - 1];
//     console.log(lastFocusableEl)
//     let KEYCODE_TAB = 9;

//     if(element.getAttribute('aria-hidden') === false) {
//         debugger
//         document.addEventListener('keydown', function (e) {
//             e.preventDefault();
//             var isTabPressed = (e.key === 'Tab' || e.keyCode === KEYCODE_TAB);


//             if (!isTabPressed) {
//                 return;
//             }

//             if (e.shiftKey) /* shift + tab */ {    
//                 if (document.activeElement === firstFocusableEl) {
//                     lastFocusableEl.focus();
//                     //e.preventDefault();
//                 }
//             } else /* tab */ {    
//                 if (document.activeElement === lastFocusableEl) {
//                     firstFocusableEl.focus();
//                     //e.preventDefault();
//                 }
//             }
//         });     
//     }
// }

/* ============================= Gestion de la page ============================= */

const mainPhotographer = function () {
    getData().then(({ photographers: photographersData, media: mediaData }) => {

        // Id du photographe de l'url
        const photographerId = parseInt(getUrlParameter('id'), 10);

        // on cible les containers dans le DOM
        const photographContainer = document.querySelector('.contactcontainer');
        const galleryContainer = document.querySelector('.gallerycontainer');
        const photographModalContainer = document.querySelector('.modal__title');
        const photographLikesContainer = document.querySelector('.likescontainer');

        // on récupere le data du photographe selectionné et ses médias
        const selectedPhotographer = findPhotographer(photographersData, photographerId);
        const selectedMedia = photographerMedia(mediaData, selectedPhotographer);

        // on créer les rendus Html
        const photographerHtml = selectedPhotographer.photographerRender();
        const photographerModalHtml = selectedPhotographer.photographerModalRender();
        const selectedMediaAllLikes = photographerLikesSum(selectedMedia);
        const photographerLikesHtml = selectedPhotographer.photographLikesRender(selectedMediaAllLikes);
        mediaSelectedHtml(selectedMedia, selectedPhotographer);
        galleryManagement(galleryContainer, selectedMedia, photographLikesContainer, selectedPhotographer);

        // on affuche les rendus
        photographContainer.innerHTML = photographerHtml;
        photographModalContainer.innerHTML = photographerModalHtml;
        photographLikesContainer.innerHTML = photographerLikesHtml;
        galleryContainer.innerHTML = photographerMediaHtml(selectedMedia, selectedPhotographer);
    });
}

mainPhotographer();
wrapperSelect();
modalManagement(mainWrapper, photographModalContainer)