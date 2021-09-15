/* ============================= LIRE LE JSON EN LOCAL ============================= */

function readJson() {
    // http://localhost:8080
    fetch('./JSON/FishEyeData.json')
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error("HTTP error " + response.status);
            }
        })
        .then(data => {
            displayPhotograph(data);
            mediaAltAdd(data);
            //console.log(data);
        })
        .catch(function () {
            this.dataError = true;
        })
}
readJson();

/* ============================= AJOUTER les ALT dans les objets ============================= */

const mediaAltAdd = function (data) {
    const media = data.media;
    let altAjoutMedia = ['Plage jaune à la mode', 'Mode Jungle Urbaine', 'Motif de mode', 'Gazebo de mariage',
        'Paillettes', '18e anniversaire', 'Sculpture de cheval en bois', 'Homme Triangle',
        'Tunnel violet', 'Mine d\'art', '8 lignes', 'Ailes de mode', 'Mélodie rouge sur rayures',
        'Conférence d\'entreprise', 'Présentation du produit', 'Clavier de festival de musique',
        'Chanteur de festival de musique', 'Majesté animale', 'Chiot mignon au coucher du soleil',
        'Montagnes Rocheuses', 'Bains extérieurs', 'Route dans la colline', 'Pont dans la forêt',
        'Promeneur de bateau', 'Portrait bronzé', 'Portrait de Shaw', 'Alexandra', 'Pause de l\'après-midi',
        'Solitaire', 'Couleur de la colline', 'Portrait du mercredi', 'Portrait de Nora',
        'Portrait noir brut', 'Mariage en bord de mer', 'Mariage au rocher', 'Mariage Benavides',
        'Chevaux sauvages dans les montagnes', 'Rainbow Bird', 'Japanese Tower, Kyoto',
        'Coucher de soleil sur les canaux, Venise', 'Montagne et Lac', 'Vélo de ville et escalier, Paris',
        'Porte d\'aventure, Inde', 'Contraste, Saint-Pétersbourg', 'Sur une colline, Tibet', 'Tour penchée, Pise',
        'Autoroutes circulaires, Buenos Aires', 'Immeuble d`\'angle et ciel bleu', 'Des tours dans l\'air',
        'Grimpeur', 'Surfer', 'Skieur', 'Fin de course', 'Saut !', 'Lumière blanche', 'Eau sur bâtiment moderne',
        'Fer à cheval', 'Barre transversale', 'Courbes connectées'];

    const newListMedia = (array => {
        for (let i = 0; i < media.length; i++) {
            media[i]["alt"] = array[i];
        }
    })

    newListMedia(altAjoutMedia);
    //console.log(data)
}

/* ============================= Afficher les données ============================= */
const setTags = new Set();

const tagSetGobal = function (tag) {
    if (!setTags.has(tag)) {
        setTags.add(tag);
    }
}

const setTagSort = function () {
    return Array.from(setTags).sort();
}

const displayPhotograph = function (data) {
    const photographers = data.photographers;
    // console.log(photographers)
    // photographers.map(photograph => {}

    photographers.forEach(photograph => {
        const name_Card = photograph.name;
        const id_Card = photograph.id;
        const location_Card = `${photograph.city}, ${photograph.country}`;
        const tags_Card = photograph.tags;
        const tagline_Card = photograph.tagline;
        const price_Card = photograph.price;
        const portrait_Card = photograph.portrait;
        // const tagsArray = tags_Card.map(tags => {
        //     return `<a href="" class="home__tags">${tags}</a>`;
        // }).join('');
        let stringTag = '';
        tags_Card.forEach(element => {
            stringTag += `<a href="" class="home__tags">${element}</a>`;
            tagSetGobal(element);
        });
        //console.log(`${stringTag}`);

        const templateCards = function () {
            return `<a href="html/photographer?${id_Card}.html" class="home__profile"><img src="/images/PhotographersID/${portrait_Card}" alt="portrait de ${name_Card}">
                    <h2 class="home__name">${name_Card}</h2></a>
                <div class="home__info">
                    <p class="home__location">${location_Card}</p>
                    <p class="home__citation">${tagline_Card}</p>
                    <p class="home__price">${price_Card}€/jours</p>
                </div>
                <div class="home__category">${stringTag}</div>`;
        }

        const section = document.createElement('section');
        section.className = 'home__photographers';

        const main = document.querySelector('.home');
        main.appendChild(section);

        section.innerHTML += templateCards();
    });

}