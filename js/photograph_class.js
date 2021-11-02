// ============================= CREER la classe photographe et ses méthodes =============================

export class Photograph {
    constructor({ name, id, country, city, tags, tagline, price, portrait }) {
        this.name = name;
        this.id = id;
        this.country = country;
        this.city = city;
        this.tags = tags;
        this.tagline = tagline;
        this.price = price;
        this.portrait = portrait;
        this.alt = `Portrait de ${name}`;
    }

    folderName() {
        return this.name.split(' ').shift().replace('-', ' ');
    }

    locationConcat() {
        return `${this.city}, ${this.country}`;
    }

    templateTags() {
        let concatTags = '';
        this.tags.forEach(function (element) {
            concatTags += `<a href="#" class="home__tags">${element}</a>`
        });
        return concatTags;
    }

    hasTags(selectedTags) {
        const intersection = selectedTags.filter(element => this.tags.includes(element));
        return intersection.length > 0;
    }

    templateRender() {
        return `<section class="home__photographers" aria-label="photographer">
                <a tabindex="0" href="photographer_page.html?id=${this.id}" class="home__profile"><img src="images/PhotographersID/${this.portrait}" alt="${this.alt}" loading="lazy">
                        <h2 class="home__name">${this.name}</h2></a>
                    <div class="home__info">
                        <p class="home__location" tabindex="0">${this.locationConcat()}</p>
                        <p class="home__citation" tabindex="0">${this.tagline}</p>
                        <p class="home__price" tabindex="0" >${this.price}&#8364/jours</p>
                    </div>
                    <div class="home__category">${this.templateTags()}</div>
                </section>`;
    }

    photographerRender() {
        return ` <section class="contact" aria-label="photographerID">
                <div class="contact__infos">
                    <h1 class="contact__name" tabindex="0">${this.name}</h1>
                    <div class="contact__location" tabindex="0">${this.locationConcat()}</div>
                    <div class="contact__citation" tabindex="0">${this.tagline}</div>
                    <div class="contact__category">${this.templateTags()}</div>
                </div>
                <button href="#" class="contact__btn">Contactez-moi</button>
                <a href="#">
                    <div class="contact__profile">
                        <img src="images/PhotographersID/${this.portrait}" alt="${this.alt}">
                    </div>
                </a>
                </section> 
                `
    }

    photographLikesRender(sumLikes) {
        return `
        <div class="likes">
        <p class="likes__count">${sumLikes} </p>
        <span class="gallery__heart"><i class="fas fa-heart"></i></span>
        </div>
        <p class="likes__dayprice">${this.price}&#8364/jours</p>
        `
    }
    
    photographerModalRender() {
        return  `Contactez moi<br/>${this.name}`
    }
}