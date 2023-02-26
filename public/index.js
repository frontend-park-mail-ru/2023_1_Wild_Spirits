import tmp from './components/smth.handlebars.js'
import navbar from './components/navbar/navbar.handlebars.js'

const res = tmp({test: "TEST"})

const root = document.getElementById('app');

root.innerHTML += res;


fetch('assets/logo-full.svg').then((response)=>{
    response.text().then((text)=>{
        const data = {
            img: text
        }
        root.innerHTML += navbar(data);
    });
});
