
import { getData } from '../js/data.js';
import { Photograph } from '../js/photograph_class.js';
import { MediaFactory, Photo, Video } from './factory_class.js';
import { modalManagement } from './modal_Contact.js';
import { wrapperSelect, getUrlParameter } from '../js/fonctions.js';
import { LightBox, onOpenLightBox, onCloseLightbox } from '../js/lightbox_class.js';





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

/* ============================= Gestion du tri des Medias  ============================= */

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

    // let toto = new PhotographRender(selectedPhotographer)
    // return selectedMedia.map(medium => toto.render(medium, photograph)).join(' ');
}

/* ============================= Likes totaux du photographe ============================= */

function photographerLikesSum(selectedMedia) {
    let sumLikes = 0;
    for (const numberOfLikes of selectedMedia) {
        sumLikes += numberOfLikes.likes
    }
    return sumLikes;
    //return selectedMedia.reduce((previousMedia , currentMedia) => previousMedia.likes + currentMedia.likes);
}

/* ============================= Incréementer les médias ============================= */

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
            openLightBox(selectedMedia, getcurrentMediaId, selectedPhotographer);
            lightBoxIsClosed = false;
        }
    })
}

/* ============================= gestion de la lightBox ============================= */

let mediaLightbox = null;
let lastIndexSelected = -1;

// Gestion des addEventListener
const arrowLeft = document.querySelector('.lightbox__arrow--left');
const arrowRight = document.querySelector('.lightbox__arrow--right');
const mainWrapper = document.querySelector('.mainpage');
const lightBoxContainer = document.querySelector('.lightboxcontainer');

function openLightBox(selectedMedia, getcurrentMediaId, selectedPhotographer) {
    // const lightBoxContainer = document.querySelector('.lightboxcontainer');
    // lightBoxContainer.classList.add('lightboxcontainer--show');

    // test pour savoir comparer deux Id selectionné et refaire la lightBox;
    if (mediaLightbox === null || lastIndexSelected != getcurrentMediaId) {
        mediaLightbox = new LightBox(selectedMedia, getcurrentMediaId, selectedPhotographer);
    }

    let lightboxContent = document.querySelector('.lightbox__content');
    lightboxContent.innerHTML = lightBoxRenderHtml(mediaLightbox, selectedPhotographer);

    arrowLeft.addEventListener('click', previousElement);
    arrowRight.addEventListener('click', nextElement);

    closeLightbox(lightBoxContainer);
}

function closeLightbox(lightBoxContainer) {
    const btncloseLb = document.querySelector('.lightbox__btnclose');
    btncloseLb.addEventListener('click', function() {
        lightBoxContainer.classList.remove('lightboxcontainer--show');
        arrowLeft.removeEventListener('click', previousElement);
        arrowRight.removeEventListener('click', nextElement);
        // mediaLightbox = null;
        // lastIndexSelected = -1;
    });
}

function previousElement(event) {
    console.log(event)
    mediaLightbox.previousMedia();
    document.querySelector('.lightbox__content').innerHTML = lightBoxRenderHtml(mediaLightbox);
}
function nextElement(event) {
    console.log(event)
    mediaLightbox.nextMedia();
    document.querySelector('.lightbox__content').innerHTML = lightBoxRenderHtml(mediaLightbox);
}
function lightBoxRenderHtml(mediaLightbox) {
    lastIndexSelected = mediaLightbox.getLastMediaId();
    console.log(lastIndexSelected)
    return mediaLightbox.render();
}

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

        // on créer les rendu Html
        const photographerHtml = selectedPhotographer.photographerRender();
        const photographerModalHtml = selectedPhotographer.photographerModalRender();
        const selectedMediaAllLikes = photographerLikesSum(selectedMedia);
        const photographerLikesHtml = selectedPhotographer.photographLikesRender(selectedMediaAllLikes);
        mediaSelectedHtml(selectedMedia, selectedPhotographer);
        galleryManagement(galleryContainer, selectedMedia, photographLikesContainer, selectedPhotographer);
        // let lightbox = new LightBox(selectedMedia, 235234343)
        // console.log(lightbox.render(selectedPhotographer));
        // lightbox.nextMedia();
        // console.log(lightbox.render(selectedPhotographer));
 
        photographContainer.innerHTML = photographerHtml;
        photographModalContainer.innerHTML = photographerModalHtml;
        photographLikesContainer.innerHTML = photographerLikesHtml;
        galleryContainer.innerHTML = photographerMediaHtml(selectedMedia, selectedPhotographer);
    });
}

mainPhotographer();
modalManagement()
wrapperSelect();