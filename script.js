class projectCard extends HTMLElement {
    constructor () {
        super();
    }
    connectedCallback() {
        let cardContent = document.getElementById('projectCardTemplate').content.cloneNode(true);

        if (this.dataset.title != null)
            cardContent.querySelector('h2').textContent = this.dataset.title;
        if (this.dataset.img != null)
            cardContent.querySelector('img').src = this.dataset.img;
        if (this.dataset.description != null)
            cardContent.querySelector('p').textContent = this.dataset.description;
        if (this.dataset.link != null)
            cardContent.querySelector('a').href = this.dataset.link;

        this.attachShadow({mode:'open'}).appendChild(cardContent);
    }

}

window.customElements.define('project-card', projectCard);

document.getElementById('getLocal').addEventListener('click', function () {getLocal();});
document.getElementById('getRemote').addEventListener('click', function () {getRemote();});

// Default for LocalStorage
localStorage.setItem('projectCards', `[{"title":"Example A"},{"title":"Example B","img":"https://source.unsplash.com/480x480/","description":"This project card loaded from local storage.","link":"https://ヘンリー・コックス.tk/"},{"title":"Example C","img":"https://source.unsplash.com/640x480/","description-override":"<h3 slot='description-override'>Override using <code>&ltslot&gt</code> tag</h3>","link":"https://ヘンリー・コックス.tk/"}]`);

function getLocal() {
    document.querySelector('output').innerHTML = null;
    JSON.parse(localStorage.getItem('projectCards')).forEach(card => createCards(card));
}

function getRemote() {
    document.querySelector('output').innerHTML = null;
    fetch(new Request("https://my-json-server.typicode.com/hhcoxatucsd/cse134-hw4-part2/cards"), {method: "GET"})
        .then((response) => response.text())
        .then ((text) => {
            JSON.parse(text).forEach(card => createCards(card));
        });
}

function createCards(cardObj) {
    let newCard = document.createElement('project-card');

    for (const property in cardObj) {
        if (property == "description-override") {
            let override = document.createElement('a');
            override.innerHTML = cardObj[property];
            override = override.firstChild;
            newCard.appendChild(override);
        }
        else {
            newCard.dataset[property] = cardObj[property];
        }
    }

    document.querySelector('output').appendChild(newCard);

}
