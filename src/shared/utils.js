import IntlRelativeFormat from 'intl-relativeformat'
import {
  START_REQUEST,
  SET_FAILED_STATE,
  END_REQUEST
} from '../Loading/module/types'

export function startRequest (commit) {
  commit(START_REQUEST)
}

export function failRequest (commit) {
  // Set the bar red if there's no more pending requests
  if (!commit(END_REQUEST)) {
    commit(SET_FAILED_STATE, true)
  }
}

export function endRequest (commit) {
  commit(END_REQUEST)
}

const rf = new IntlRelativeFormat('en')
export function formattedDate (dateValue) {
  return rf.format(dateValue instanceof Date ? dateValue : new Date(dateValue))
}
