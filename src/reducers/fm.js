'use strict'

import {
  PLAYLIST_LOADING, PLAYLIST_NEW_REQUEST,
  PLAYLIST_RESPONSE, SONG_LYRIC_RESPONSE,
  PLAYLIST_NEXT_SONG, PLAYLIST_PLAYING_REQUEST,
  PLAYLIST_SKIP_REQUEST, PLAYLIST_TRASH_REQUEST,
  RED_HEART_LIST, RED_HEART_RATE,
  RED_HEART_UNRATE, RED_HEART_RATE_NEXT_SONG_APPEND,
  RED_HEART_UN_RATE_NEXT_SONG_APPEND, PLAYLIST_END_REQUEST,
  RED_HEART_EMPTY
} from '../actions/fm/types'

const fmReducer = (state = {
  isFetching: false,
  playlist: {},
  type: '',
  sid: '',
  ssid: '',
  song: [],
  lyric: {},
  redheart: {}
}, action) => {
  switch (action.type) {
    case PLAYLIST_LOADING:
      return Object.assign({}, state, {
        isFetching: true
      })
    case PLAYLIST_NEW_REQUEST:
      return Object.assign({}, state, {
        type: 'n'
      })
    case PLAYLIST_PLAYING_REQUEST:
      return Object.assign({}, state, {
        type: 'p'
      })
    case PLAYLIST_SKIP_REQUEST:
      return Object.assign({}, state, {
        type: 's'
      })
    case PLAYLIST_TRASH_REQUEST:
      return Object.assign({}, state, {
        type: 'b'
      })
    case RED_HEART_RATE:
      return Object.assign({}, state, {
        type: 'r'
      })
    case RED_HEART_UNRATE:
      return Object.assign({}, state, {
        type: 'u'
      })
    case PLAYLIST_RESPONSE:
      return Object.assign({}, state, {
        playlist: action.playlist,
        sid: action.sid,
        ssid: action.ssid,
        song: action.song
      })
    case SONG_LYRIC_RESPONSE:
      return Object.assign({}, state, {
        isFetching: false,
        lyric: action.lyric
      })
    case PLAYLIST_NEXT_SONG:
      return Object.assign({}, state, {
        type: 'continue',
        sid: state.song[1].sid,
        ssid: state.song[1].ssid,
        song: state.song.slice(1)
      })
    case RED_HEART_LIST:
      return Object.assign({}, state, {
        redheart: action.redheart
      })
    case RED_HEART_RATE_NEXT_SONG_APPEND:
      return Object.assign({}, state, {
        song: state.song.concat(action.song)
      })
    case RED_HEART_UN_RATE_NEXT_SONG_APPEND:
      return Object.assign({}, state, {
        song: state.song.slice(0, -1).concat(action.song)
      })
    case PLAYLIST_END_REQUEST:
      return Object.assign({}, state, {
        type: 'e'
      })
    case RED_HEART_EMPTY:
      return Object.assign({}, state, {
        redheart: {}
      })
    default:
      return state
  }
}

export default fmReducer