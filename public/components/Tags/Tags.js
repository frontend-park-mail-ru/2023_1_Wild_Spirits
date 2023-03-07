/** @module Components */

import { Component } from "/components/Component.js";
import TagsTemplate from "/compiled/Tags/Tags.handlebars.js";

/**
 * @class
 * @extends Component
 * Component for tags menu
 */

export class Tags extends Component {
    static tagNames = ["Бесплатно", "С друзьями", "С детьми", "Всей семьёй", "Для пенсионеров",
             "Вечером", "Тематические праздники", "Мастер-классы", "Со второй половинкой"]
    
    #tags;
    constructor(parent) {
        super(parent)

        this.#tags = Tags.tagNames.map((tagName)=>({
                text: tagName,
                active: false
        }));

        this.registerEvent(()=>document.getElementsByClassName("tag"), "click", this.#toggleTag);
    }

    #toggleTag = (event) => {
        event.preventDefault();

        let el = event.target;

        let tag = this.#tags.find((tag)=>tag.text === el.innerText);
        tag.active ^= true;

        if (el.classList.contains("active")) {
            el.classList.remove("active");
        } else {
            el.classList.add("active");
        }
    }

    render() {
        return TagsTemplate({
            tags: this.#tags
        })
    }
}
