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
