export const onOpenLightBox = (mainWrapper, lightBoxContainer, btnCloseLightBox) => {
    lightBoxContainer.style.display = 'block';
    lightBoxContainer.setAttribute('aria-hidden', 'false');
    lightBoxContainer.setAttribute('aria-modal', 'true');
    mainWrapper.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = 'hidden';
    btnCloseLightBox.focus();
}

export const onCloseLightbox = (mainWrapper, lightBoxContainer) => {
    lightBoxContainer.style.display = 'none';
    lightBoxContainer.setAttribute('aria-hidden', 'true');
    lightBoxContainer.removeAttribute('aria-modal');
    mainWrapper.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'visible';
}

export const onOpenModal = (mainWrapper, photographModalContainer) => {
    photographModalContainer.style.display = 'block';
    photographModalContainer.setAttribute('aria-hidden', 'false');
    photographModalContainer.setAttribute('aria-modal', 'true');
    mainWrapper.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = 'hidden';
    document.querySelector('.modal__close').focus();
}

export const onCloseModal = (mainWrapper, photographModalContainer) => {
    photographModalContainer.style.display = 'none';
    photographModalContainer.setAttribute('aria-hidden', 'true');
    photographModalContainer.setAttribute('aria-modal', 'false');
    mainWrapper.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'visible';
}