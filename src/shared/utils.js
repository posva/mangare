import IntlRelativeFormat from 'intl-relativeformat'
import {
  START_REQUEST,
  END_REQUEST
} from '../Loading/module/types'

export function startRequest (commit) {
  commit(START_REQUEST)
}

export function endRequest (commit) {
  commit(END_REQUEST)
}

const rf = new IntlRelativeFormat('en')
export function formattedDate (dateValue) {
  return rf.format(dateValue instanceof Date ? dateValue : new Date(dateValue))
}
