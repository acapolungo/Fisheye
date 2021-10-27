export const onOpenLightBox = (mainWrapper, lightBoxContainer, btnCloseLightBox) => {
    mainWrapper.setAttribute('aria-hidden', 'true');
    lightBoxContainer.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    lightBoxContainer.classList.add('lightboxcontainer--show');
    btnCloseLightBox.focus()
}

export const onCloseLightbox = (mainWrapper, lightBoxContainer) => {
    mainWrapper.setAttribute('aria-hidden', 'false');
    lightBoxContainer.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = 'visible';
    lightBoxContainer.classList.remove('lightboxcontainer--show');
    //$openModalBtn.focus()
}

export const onOpenModal = (mainWrapper, photographModalContainer) => {
    mainWrapper.setAttribute('aria-hidden', 'true');
    photographModalContainer.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    photographModalContainer.classList.add('modalcontainer--show')
    //$modalCloseBtn.focus()
}

export const onCloseModal = (mainWrapper, photographModalContainer) => {
    mainWrapper.setAttribute('aria-hidden', 'false');
    photographModalContainer.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = 'visible';
    photographModalContainer.classList.remove('modalcontainer--show')
    //$openModalBtn.focus()
}