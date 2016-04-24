import Vue from 'vue'

export function timeout (delay) {
  return new Promise(resolve => setTimeout(resolve, delay))
}

export function nextTick (instance = Vue) {
  const fn = instance === Vue ? 'nextTick' : '$nextTick'
  return new Promise(resolve => instance[fn](resolve))
}
