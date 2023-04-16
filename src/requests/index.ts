import { configureRequestManager } from "./requestManager";

import { loadCategories, loadCities } from "./header"
import { loadEvents } from "./events";
import { addFriend, loadAuthorization, loadFriends, loadProfile, loginUser, logoutUser, registerUser } from "./user"
import { loadTags } from "./tags";

const requests = [
    {
        request: loadAuthorization, 
        dependencies: []
    },
    {
        request: loadCities, 
        dependencies: [loadAuthorization]
    },
    {
        request: loadCategories, 
        dependencies: []
    },
    {
        request: loadTags, 
        dependencies: []
    },
    {
        request: loadEvents, 
        dependencies: [loadAuthorization, loadCities]
    },
    {
        request: loadProfile, 
        dependencies: [loadAuthorization]
    },
    {
        request: loadFriends, 
        dependencies: []
    },
    {
        request: addFriend, 
        dependencies: []
    },
    {
        request: loginUser, 
        dependencies: []
    },
    {
        request: logoutUser, 
        dependencies: []
    },
    {
        request: registerUser, 
        dependencies: []
    },
]

export let requestManager = configureRequestManager(requests);
