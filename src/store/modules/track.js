import trackService from '../../services/entities/trackService'
import _ from "lodash";

function thumbnail(trackId) {
    return trackService.getThumbnail(trackId);
}

const state = {
    active: null,
    tracks: [],
    suggestions: []
}

const getters = {
    active: state => {
        return state.active
    },
    tracks: state => {
        return state.tracks
    },
}

const actions = {
    setActiveTrack({ commit }, track) {
        commit('setActiveTrack', track)
    },
    getTracksNoData({ commit }) {
        trackService.fetchTracks()
            .then(tracks => {
                commit('setTracks', tracks)
            })
    },
    getTracks({ commit }) {
        trackService.fetchTracks()
            .then(async tracks => {
                for (const track of tracks) {
                    if (track.status === 'IN' || track.status === 'HIDDEN') {
                        if (!track.data)
                            track.data = await trackService.getThumbnail(track.id)
                    }
                }
                commit('setTracks', tracks)
            })
    },
    addTrack({ commit }, track) {
        trackService.postTrack(track)
            .then(() => {
                commit('addTrack', track)
            })
    },
    updateTrack({ commit }, track) {
        trackService.putTrack(track, track.id)
            .then(() => {
                commit('putTrack', track)
            })
    },
    deleteTrack({ commit }, msgId) {
        trackService.deleteTrack(msgId)
        commit('deleteTrack', msgId)
    },
    getSuggestions( {commit }, track) {
        trackService.getSuggestions(track.id)
            .then(async suggestion => {
                if (!suggestion.data)
                    suggestion.data = await trackService.getThumbnail(suggestion.id)
                commit('addSuggestion', suggestion)
            })
    },
}

const mutations = {
    setActiveTrack(state, track) {
        state.active = track
    },
    setTracks(state, tracks) {
        state.tracks = tracks
    },
    addTrack(state, track) {
        if (!track.data && !track.isLoading && (track.status === 'IN' || track.status === 'HIDDEN')) {
            track.isLoading = true
            trackService.getThumbnail(track.id).then((data) => {
                track.data = data
                track.isLoading = false
            })
        }
        state.tracks.push(track)
        state.tracks = _.orderBy(state.tracks, "lastseen_timestamp", "desc")
    },
    putTrack(state, track) {
        const existing_tracks = state.tracks.filter(tr => tr.id === track.id)

        if (existing_tracks.length === 1) {
            const existing_track = existing_tracks[0]
            track.data = existing_track.data
            track.isLoading = existing_track.isLoading
        }
        if (!track.data && !track.isLoading && (track.status === 'IN' || track.status === 'HIDDEN')) {
            track.isLoading = true
            trackService.getThumbnail(track.id).then((data) => {
                track.data = data
                track.isLoading = false
            })
        }

        state.tracks = state.tracks.filter(tr => tr.id !== track.id)
        state.tracks.push(track)
        state.tracks = _.orderBy(state.tracks, "lastseen_timestamp", "desc")
    },
    deleteTrack(state, msgId) {
        state.tracks = state.tracks.filter(tr => tr.id !== msgId)
    },
    addSuggestion(state, suggestion) {
        state.suggestions.push(suggestion)
    }
}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations,
    thumbnail
}