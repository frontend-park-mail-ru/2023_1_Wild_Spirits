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
    loadSubbedEvents,
    loadInfinityEvents,
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
    patchProfile,
} from "./user";
import { loadTags } from "./tags";
import { TRequest } from "./requestTypes";
import { findEventPlaces, loadPlaces } from "./places";
import { acceptInvitation, createWebSocket, declineInvitation, inviteUserToEvent, loadInvites } from "./notifications";

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
        request: findEventPlaces,
        dependencies: [],
    },
    {
        request: loadEvents,
        dependencies: [loadAuthorization, loadCities, loadTags, loadCategories],
    },
    {
        request: loadInfinityEvents,
        dependencies: [loadEvents, loadAuthorization, loadCities, loadTags, loadCategories],
    },
    {
        request: loadLikedEvents,
        dependencies: [loadAuthorization, loadCities, loadTags, loadCategories],
    },
    {
        request: loadPlannedEvents,
        dependencies: [loadAuthorization, loadCities, loadTags, loadCategories],
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
        request: loadSubbedEvents,
        dependencies: [loadAuthorization, loadCities, loadTags, loadCategories],
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
    {
        request: patchProfile,
        dependencies: [loadAuthorization],
    },
    {
        request: loadInvites,
        dependencies: [loadAuthorization],
    },
    {
        request: createWebSocket,
        dependencies: [loadAuthorization, loadInvites],
    },
    {
        request: inviteUserToEvent,
        dependencies: [],
    },
    {
        request: acceptInvitation,
        dependencies: [loadAuthorization],
    },
    {
        request: declineInvitation,
        dependencies: [loadAuthorization],
    },
];

export const requestManager = configureRequestManager(requests);
