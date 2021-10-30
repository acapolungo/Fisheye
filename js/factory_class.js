

//============================= CREER la classe Media  =============================

//     mediaPhoto() {
//         if (typeof this.video !== 'undefined') {
//             return this.photo = photo;
//         }
//     }

//     mediaVideo() {
//         if (typeof this.photo !== 'undefined') {
//             return this.video = video;
//         }

//     }
// }

// function isVideo(mediumData) {
//     return mediumData.video !== undefined;
// }
// function isPhoto(mediumData) {
//     return mediumData.image !== undefined;
// }

export class MediaFactory {
    static createMedium(mediumData) {
        let medium;

        if (mediumData.video !== undefined) {
            medium = new Video(mediumData)
        } else if (mediumData.image !== undefined) {
            medium = new Photo(mediumData)
        }
        return medium;
    };
}

export class Video {
    constructor({ video: fileVideo, id, photographerId, title, tags, likes, date, price }) {
        this.fileVideo = fileVideo;
        this.id = id;
        this.photographerId = photographerId;
        this.title = title;
        this.tags = tags;
        this.likes = likes;
        this.date = date;
        this.price = price;
    }
    
    render(photograph) {
        return (`
            <section class="gallery" aria-label="video">
                <a href="#">
                    <div class="gallery__video"><video controls src="images/${photograph.folderName()}/${this.fileVideo}" alt="${this.title}" type="video/mp4" loading="lazy">
                    </video></div>
                </a>
                <div class="gallery__content">
                    <p class="gallery_txt">${this.title}</p>
                    <div class="gallery__like">
                        <p class="gallery__count">${this.likes}</p>
                        <span class="gallery__heart"><i class="fas fa-heart"></i></span>
                    </div>
                </div>
            </section>
        `)
    }
}

export class Photo {
    constructor({ image: fileImage, id, photographerId, title, tags, likes, date, price }) {
        this.fileImage = fileImage;
        this.id = id;
        this.photographerId = photographerId;
        this.title = title;
        this.tags = tags;
        this.likes = likes;
        this.date = date;
        this.price = price;
    }  

    render(photograph) {
        return (`
            <section class="gallery" media-id=${this.id} aria-label="photo">
                <a href="#">
                    <div class="gallery__photo"><img src="images/${photograph.folderName()}/${this.fileImage}" alt="${this.title}" loading="lazy">
                    </div>
                </a>
                <div class="gallery__content">
                    <p class="gallery_txt">${this.title}</p>
                    <div class="gallery__like">
                        <p class="gallery__count">${this.likes}</p>
                        <span class="gallery__heart"><i class="fas fa-heart"></i></span>
                    </div>
                </div>
            </section>
        `)
    }
}

// https://www.dofactory.com/javascript/design-patterns/factory-method
// https://betterprogramming.pub/javascript-design-patterns-25f0faaaa15