import { configureRequestManager } from "./requestManager";

import { loadCities } from "./header"
import { TRequest, TRequestResolver } from "./requestTypes"
import { loadAuthorization } from "./user"


const requests = [
    {
        request: loadAuthorization, 
        dependencies: []
    },
    {
        request: loadCities, 
        dependencies: [loadAuthorization]
    },
]

export let requestManager = configureRequestManager(requests);
