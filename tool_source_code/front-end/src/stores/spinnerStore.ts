import { defineStore } from 'pinia'

export const spinnerStore = defineStore('Spinner', {
  state: () => ({
    count: 0
  }),
  actions: {
    show() {
      this.count++
    },
    hide() {
      if (this.count === 0) {
        return
      }
      this.count--
    }
  }
})
