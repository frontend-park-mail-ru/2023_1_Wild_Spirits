import { configureRequestManager } from "./requestManager";

import { loadCategories, loadCities } from "./header";
import { loadEventProcessingEdit, loadEventProcessingCreate, loadEvents, loadEventPage, likeEvent, dislikeEvent, loadLikedEvents } from "./events";
import {
    addFriend,
    loadAuthorization,
    loadFriends,
    loadProfile,
    loginUser,
    logoutUser,
    registerUser,
    searchUsers,
    registerOrganizer,
    deleteFriend
} from "./user";
import { loadTags } from "./tags";
import { TRequest } from "./requestTypes";
import { loadPlaces } from "./places";

interface SetupRequestsType {
    request: TRequest;
    dependencies: TRequest[];
}

const requests: SetupRequestsType[] = [
    {
        request: loadAuthorization,
        dependencies: [],
    },
    {
        request: loadCities,
        dependencies: [loadAuthorization],
    },
    {
        request: loadCategories,
        dependencies: [],
    },
    {
        request: loadTags,
        dependencies: [],
    },
    {
        request: loadPlaces,
        dependencies: [],
    },
    {
        request: loadEvents,
        dependencies: [loadAuthorization, loadCities],
    },
    {
        request: loadLikedEvents,
        dependencies: [loadCities],
    },
    {
        request: loadProfile,
        dependencies: [loadAuthorization],
    },
    {
        request: loadFriends,
        dependencies: [],
    },
    {
        request: addFriend,
        dependencies: [],
    },
    {
        request: loginUser,
        dependencies: [],
    },
    {
        request: logoutUser,
        dependencies: [],
    },
    {
        request: registerUser,
        dependencies: [],
    },
    {
        request: registerOrganizer,
        dependencies: [],
    },
    {
        request: loadEventProcessingEdit,
        dependencies: [loadAuthorization, loadTags, loadPlaces],
    },
    {
        request: loadEventProcessingCreate,
        dependencies: [loadAuthorization, loadTags, loadPlaces],
    },
    {
        request: loadEventPage,
        dependencies: [loadAuthorization, loadTags],
    },
    {
        request: searchUsers,
        dependencies: [],
    },
    {
        request: deleteFriend,
        dependencies: [],
    },
    {
        request: likeEvent,
        dependencies: [loadAuthorization],
    },
    {
        request: dislikeEvent,
        dependencies: [loadAuthorization]
    }
]

export let requestManager = configureRequestManager(requests);
