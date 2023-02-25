import tmp from './components/smth.handlebars.js'
import nested from './components/directory/directory/nested.handlebars.js'

const res = tmp({test: "TEST"})

const root = document.getElementById('app');

root.innerHTML += res;
root.innerHTML += nested({nestedTest: "NESTED TEST"});
