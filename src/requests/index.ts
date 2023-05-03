import { configureRequestManager } from "./requestManager";

import { loadCategories, loadCities } from "./header";
import {
    loadEventProcessingEdit,
    loadEventProcessingCreate,
    loadEvents,
    loadEventPage,
    loadEnventsMap,
    likeEvent,
    dislikeEvent,
    loadLikedEvents,
    loadPlannedEvents,
    featureEvent,
    unfeatureEvent,
    loadEventPageOrgEvents,
    loadProfileOrgEvents,
} from "./events";
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
    deleteFriend,
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
        dependencies: [loadAuthorization, loadCities, loadTags, loadCategories],
    },
    {
        request: loadLikedEvents,
        dependencies: [loadProfile, loadCities, loadTags, loadCategories],
    },
    {
        request: loadPlannedEvents,
        dependencies: [loadProfile, loadCities, loadTags, loadCategories],
    },
    {
        request: loadEventPageOrgEvents,
        dependencies: [loadEventPage, loadCities, loadTags, loadCategories],
    },
    {
        request: loadProfileOrgEvents,
        dependencies: [loadProfile, loadCities, loadTags, loadCategories],
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
        dependencies: [loadAuthorization, loadTags, loadPlaces, loadCategories],
    },
    {
        request: loadEventProcessingCreate,
        dependencies: [loadAuthorization, loadTags, loadPlaces, loadCategories],
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
        request: loadEnventsMap,
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
        dependencies: [loadAuthorization],
    },
    {
        request: featureEvent,
        dependencies: [loadAuthorization],
    },
    {
        request: unfeatureEvent,
        dependencies: [loadAuthorization],
    },
];

export let requestManager = configureRequestManager(requests);
