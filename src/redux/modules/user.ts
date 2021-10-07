import produce, { Draft } from 'immer'
import deepmerge from 'deepmerge'
import { reduceReducers } from './utils'
import { fr, enGB } from 'date-fns/locale'
import format from 'date-fns/format'

import defaultColors from '~themes/colors'
import darkColors from '~themes/darkColors'
import blackColors from '~themes/blackColors'
import sepiaColors from '~themes/sepiaColors'

import { firebaseDb } from '~helpers/firebase'
import i18n, { getLangIsFr } from '~i18n'

import highlightsReducer from './user/highlights'
import notesReducer from './user/notes'
import settingsReducer from './user/settings'
import tagsReducer from './user/tags'
import versionUpdateReducer from './user/versionUpdate'
import studiesReducer from './user/studies'
import { SubscriptionType, Tag } from '~common/types'
import { Reducer } from 'redux'
import { Alert } from 'react-native'

export * from './user/highlights'
export * from './user/notes'
export * from './user/settings'
export * from './user/tags'
export * from './user/versionUpdate'
export * from './user/studies'

export const USER_LOGIN_SUCCESS = 'USER_LOGIN_SUCCESS'
export const USER_UPDATE_PROFILE = 'USER_UPDATE_PROFILE'
export const USER_LOGOUT = 'USER_LOGOUT'

export const SAVE_ALL_LOGS_AS_SEEN = 'user/SAVE_ALL_LOGS_AS_SEEN'

export const SET_HISTORY = 'user/SET_HISTORY'
export const DELETE_HISTORY = 'user/DELETE_HISTORY'

export const SET_LAST_SEEN = 'user/SET_LAST_SEEN'

export const SET_NOTIFICATION_VOD = 'user/SET_NOTIFICATION_VOD'
export const SET_NOTIFICATION_ID = 'user/SET_NOTIFICATION_ID'

export const TOGGLE_COMPARE_VERSION = 'user/TOGGLE_COMPARE_VERSION'
export const RESET_COMPARE_VERSION = 'user/RESET_COMPARE_VERSION'

export const GET_CHANGELOG = 'user/GET_CHANGELOG'
export const GET_CHANGELOG_SUCCESS = 'user/GET_CHANGELOG_SUCCESS'
export const GET_CHANGELOG_FAIL = 'user/GET_CHANGELOG_FAIL'

export const SET_FONT_FAMILY = 'user/SET_FONT_FAMILY'

export const APP_FETCH_DATA = 'user/APP_FETCH_DATA'
export const APP_FETCH_DATA_FAIL = 'user/APP_FETCH_DATA_FAIL'

export const SET_SUBSCRIPTION = 'user/SET_SUBSCRIPTION'
export const EMAIL_VERIFIED = 'user/EMAIL_VERIFIED'

export interface Study {
  id: string
  title: string
  created_at: number
  content: {
    ops: string[]
  }
  published?: boolean
  user: {
    displayName: string
    id: string
    photoUrl: string
  }
  tags?: { [x: string]: Tag }
}
interface UserState {
  id: string
  email: string
  displayName: string
  photoURL: string
  provider: string
  lastSeen: number
  subscription?: string
  emailVerified: boolean
  isLoading: boolean
  notifications: {
    verseOfTheDay: string
    notificationId: string
  }
  changelog: {
    isLoading: boolean
    lastSeen: number
    data: any[]
  }
  needsUpdate: {
    [x: string]: boolean
  }
  fontFamily: string
  bible: {
    changelog: {}
    highlights: {
      [x: string]: {
        color: string
        tags: {
          [x: string]: Tag
        }
        date: number
      }
    }
    notes: {}
    studies: {
      [x: string]: Study
    }
    tags: {}
    history: any[]
    strongsHebreu: {}
    strongsGrec: {}
    words: {}
    naves: {}
    settings: {
      alignContent: string
      fontSizeScale: number
      textDisplay: string
      theme: 'default' | 'dark' | 'black' | 'sepia'
      press: string
      notesDisplay: string
      commentsDisplay: boolean
      colors: {
        default: typeof defaultColors
        dark: typeof darkColors
        black: typeof blackColors
        sepia: typeof sepiaColors
      }
      compare: {
        [x: string]: boolean
      }
    }
  }
}

const initialState: UserState = {
  id: '',
  email: '',
  displayName: '',
  photoURL: '',
  provider: '',
  lastSeen: 0,
  subscription: undefined,
  emailVerified: false,
  isLoading: false,
  notifications: {
    verseOfTheDay: '07:00',
    notificationId: '',
  },
  changelog: {
    isLoading: true,
    lastSeen: 0,
    data: [],
  },
  needsUpdate: {},
  fontFamily: 'Literata Book',
  bible: {
    changelog: {},
    highlights: {},
    notes: {},
    studies: {},
    tags: {},
    history: [],
    strongsHebreu: {},
    strongsGrec: {},
    words: {},
    naves: {},
    settings: {
      alignContent: 'justify',
      fontSizeScale: 0,
      textDisplay: 'inline',
      theme: 'default',
      press: 'longPress',
      notesDisplay: 'inline',
      commentsDisplay: false,
      colors: {
        default: defaultColors,
        dark: darkColors,
        black: blackColors,
        sepia: sepiaColors,
      },
      compare: {
        [getLangIsFr() ? 'LSG' : 'KJV']: true,
      },
    },
  },
}

const overwriteMerge = (destinationArray, sourceArray) => sourceArray

// UserReducer
const userReducer = produce((draft: Draft<UserState>, action) => {
  switch (action.type) {
    case EMAIL_VERIFIED: {
      draft.emailVerified = true
      break
    }
    case APP_FETCH_DATA: {
      draft.isLoading = true
      break
    }
    case APP_FETCH_DATA_FAIL: {
      draft.isLoading = false
      break
    }
    case SET_FONT_FAMILY: {
      draft.fontFamily = action.payload
      break
    }
    case SET_NOTIFICATION_VOD: {
      draft.notifications.verseOfTheDay = action.payload
      break
    }
    case SET_LAST_SEEN: {
      draft.lastSeen = Date.now()
      break
    }
    case USER_UPDATE_PROFILE:
    case USER_LOGIN_SUCCESS: {
      const {
        id,
        email,
        displayName,
        photoURL,
        provider,
        lastSeen,
        emailVerified,
        subscription,
        bible,
      } = action.profile

      const getStudies = () => {
        // Now take care of studies
        if (action.studies && Object.keys(action.studies).length) {
          if (draft.bible.studies) {
            Object.keys(action.studies).forEach(remoteStudyId => {
              if (draft.bible.studies[remoteStudyId]) {
                // We have a conflict here
                console.log(
                  `We have a conflict with ${remoteStudyId}, pick by modified_date`
                )
                const localModificationDate =
                  draft.bible.studies[remoteStudyId].modified_at
                const remoteModificationDate =
                  action.studies[remoteStudyId].modified_at
                if (remoteModificationDate > localModificationDate) {
                  console.log('Remote date is recent')
                  draft.bible.studies[remoteStudyId] =
                    action.studies[remoteStudyId]
                }
              } else {
                // No conflicts, just put that study in there
                console.log(
                  `No conflicts for ${remoteStudyId}, just put that story in there`
                )
                draft.bible.studies[remoteStudyId] =
                  action.studies[remoteStudyId]
              }
            })
          } else {
            draft.bible.studies = {}
            draft.bible.studies = bible.studies
          }
        }
      }

      const { isLogged, localLastSeen, remoteLastSeen } = action

      draft.id = id
      draft.email = email
      draft.displayName = displayName
      draft.photoURL = photoURL
      draft.provider = provider
      draft.lastSeen = lastSeen
      draft.emailVerified = emailVerified
      draft.isLoading = false
      draft.subscription = subscription

      if (!isLogged) {
        console.log('User was not logged, merge data')

        if (bible) {
          draft.bible = deepmerge(draft.bible, bible, {
            arrayMerge: overwriteMerge,
          })
          getStudies()
        }
      } else if (remoteLastSeen > localLastSeen) {
        // Remote wins
        console.log('Remote wins')
        if (bible) {
          draft.bible = { ...draft.bible, ...bible }
          getStudies()
        }
      } else if (remoteLastSeen < localLastSeen) {
        console.log('Local wins')
        // Local wins - do nothing
      } else {
        console.log('Last seen equals remote last seen, do nothing')
      }

      // Take care of migratin
      if (!draft.bible.settings.colors.black) {
        draft.bible.settings.colors.black = blackColors
      }

      if (!draft.bible.settings.colors.sepia) {
        draft.bible.settings.colors.sepia = sepiaColors
      }

      break
    }
    case USER_LOGOUT: {
      return {
        ...initialState,
        bible: {
          ...initialState.bible,
          // Keep changelog
          changelog: draft.bible.changelog,
        },
      }
    }
    case SAVE_ALL_LOGS_AS_SEEN: {
      action.payload.forEach(log => {
        draft.bible.changelog[log.date] = true
      })
      break
    }
    case DELETE_HISTORY: {
      draft.bible.history = []
      break
    }
    case SET_HISTORY: {
      const item = action.payload
      if (draft.bible.history.length) {
        const prevItem = draft.bible.history[0]
        if (prevItem.type === item.type) {
          if (
            item.type === 'verse' &&
            item.book == prevItem.book &&
            item.chapter == prevItem.chapter &&
            item.version == prevItem.version
          ) {
            return draft
          }

          if (item.type === 'strong' && item.Code == prevItem.Code) {
            return draft
          }

          if (item.type === 'word' && item.word == prevItem.word) {
            return draft
          }
        }
      }

      draft.bible.history.unshift({
        ...action.payload,
        date: Date.now(),
      })
      draft.bible.history = draft.bible.history.slice(0, 50)
      break
    }
    case TOGGLE_COMPARE_VERSION: {
      if (draft.bible.settings.compare[action.payload]) {
        delete draft.bible.settings.compare[action.payload]
      } else {
        draft.bible.settings.compare[action.payload] = true
      }
      break
    }
    case RESET_COMPARE_VERSION: {
      draft.bible.settings.compare = {
        [action.payload]: true,
      }
      break
    }
    case SET_NOTIFICATION_ID: {
      draft.notifications.notificationId = action.payload
      break
    }
    case GET_CHANGELOG_SUCCESS: {
      draft.changelog.isLoading = false
      draft.changelog.lastSeen = Date.now().toString()
      draft.changelog.data = [...draft.changelog.data, ...action.payload]
      break
    }
    case GET_CHANGELOG_FAIL: {
      draft.changelog.isLoading = false
      break
    }
    case SET_SUBSCRIPTION: {
      draft.subscription = action.payload
      break
    }
    default: {
      break
    }
  }
}) as Reducer<UserState>

const reducers = <typeof userReducer>(
  reduceReducers(
    initialState,
    userReducer,
    notesReducer,
    highlightsReducer,
    settingsReducer,
    tagsReducer,
    versionUpdateReducer,
    studiesReducer
  )
)

export default reducers

// Email verified
export function verifyEmail() {
  return {
    type: EMAIL_VERIFIED,
  }
}

// FONT-FAMILY
export function setFontFamily(payload) {
  return {
    type: SET_FONT_FAMILY,
    payload,
  }
}

// CHANGELOG
export function saveAllLogsAsSeen(payload) {
  return {
    type: SAVE_ALL_LOGS_AS_SEEN,
    payload,
  }
}

// USERS
export function onUserLoginSuccess({ profile, remoteLastSeen }: any) {
  return async (dispatch: any, getState: any) => {
    const { id, lastSeen } = getState().user

    console.log('Online last seen:', new Date(remoteLastSeen))
    console.log('Local last seen:', new Date(lastSeen))

    const dispatchUserSuccess = async (overwriteRemoteLastSeen?: boolean) => {
      const userRef = firebaseDb.collection('users').doc(profile.id)
      const userStatusRef = firebaseDb
        .collection('users-status')
        .doc(profile.id)
      const isLogged = !!id
      const studies = {}
      remoteLastSeen = overwriteRemoteLastSeen ? 0 : remoteLastSeen

      if (isLogged) {
        userRef.set(profile, { merge: true })
        userStatusRef.set({ lastSeen: profile.lastSeen }, { merge: true })
      }

      if (remoteLastSeen > lastSeen || !isLogged) {
        console.time('Remote wins, get user')
        const userDoc = await userRef.get()
        const userData = userDoc.data()
        profile = { ...profile, ...userData }
        console.log({ id: profile.id, userData })
        console.timeEnd('Remote wins, get user')

        console.time('Remote wins, get studies')
        const querySnapshot = await firebaseDb
          .collection('studies')
          .where('user.id', '==', profile.id)
          .get()

        querySnapshot.forEach(doc => {
          const study = doc.data()
          studies[study.id] = study
        })
        console.timeEnd('Remote wins, get studies')
      }

      return dispatch({
        type: USER_LOGIN_SUCCESS,
        isLogged: !!id,
        localLastSeen: lastSeen,
        profile,
        remoteLastSeen,
        studies,
      })
    }

    // Handle conflict only when user is already logged
    if (remoteLastSeen > lastSeen && id) {
      console.log('Handle conflict.')

      // * Dirty, but it works without changing a lot
      Alert.alert(
        i18n.t('Conflit de sauvegarde'),
        `${i18n.t(
          'Nous avons trouvé une sauvegarde plus récente sur le cloud.\nRécupérer les donnéees du cloud ou garder les données locales ?'
        )}
        
        ${i18n.t('Dernière sauvegarde locale')}: ${format(
          new Date(lastSeen),
          'PPPPpppp',
          {
            locale: getLangIsFr() ? fr : enGB,
          }
        )}\n
        ${i18n.t('Dernière sauvegarde en ligne')}: ${format(
          new Date(remoteLastSeen),
          'PPPPpppp',
          {
            locale: getLangIsFr() ? fr : enGB,
          }
        )}

        `,
        [
          {
            text: i18n.t('Cloud'),
            onPress: () => dispatchUserSuccess(),
          },
          {
            text: i18n.t('Local'),
            onPress: () => dispatchUserSuccess(true),
          },
        ]
      )
    } else {
      dispatchUserSuccess()
    }
  }
}

export function onUserLogout() {
  return {
    type: USER_LOGOUT,
  }
}

export function onUserUpdateProfile(profile) {
  return {
    type: USER_UPDATE_PROFILE,
    payload: profile,
  }
}

// HISTORY
export function setHistory(item) {
  return {
    type: SET_HISTORY,
    payload: item,
  }
}

export function deleteHistory() {
  return {
    type: DELETE_HISTORY,
  }
}

// Notifications
export function setNotificationVOD(payload: string) {
  return {
    type: SET_NOTIFICATION_VOD,
    payload,
  }
}

export function setNotificationId(payload) {
  return {
    type: SET_NOTIFICATION_ID,
    payload,
  }
}

// Compare
export function toggleCompareVersion(payload: string) {
  return {
    type: TOGGLE_COMPARE_VERSION,
    payload,
  }
}

export function resetCompareVersion(payload: 'LSG' | 'KJV') {
  return {
    type: RESET_COMPARE_VERSION,
    payload,
  }
}

// Changelog
export function getChangelog() {
  return async (dispatch, getState) => {
    dispatch({
      type: GET_CHANGELOG,
    })
    const lastChangelog = getState().user.changelog.lastSeen.toString()
    const changelogDoc = firebaseDb
      .collection('changelog')
      .where('date', '>', lastChangelog)
      .orderBy('date', 'desc')
      .limit(20)

    try {
      const querySnapshot = await changelogDoc.get({ source: 'server' })

      const changelog = []
      querySnapshot.forEach(doc => {
        changelog.push(doc.data())
      })

      return dispatch(addChangelog(changelog))
    } catch (e) {
      console.log(e)
      return dispatch({
        type: GET_CHANGELOG_FAIL,
      })
    }
  }
}

export function addChangelog(payload) {
  return {
    type: GET_CHANGELOG_SUCCESS,
    payload,
  }
}

export function setSubscription(payload: SubscriptionType) {
  return {
    type: SET_SUBSCRIPTION,
    payload,
  }
}
