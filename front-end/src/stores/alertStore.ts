import { defineStore } from 'pinia'

function log(msg: string, _status: string = 'info'): void {
  let color: string = 'Black'
  let bgc: string = 'White'

  switch (_status) {
    case 'success':
      //color = 'Green'
      color = 'White'
      bgc = 'LimeGreen'
      break
    case 'info':
      bgc = 'DodgerBlue'
      //color = 'Turquoise'
      color = 'White'
      break
    case 'error':
      //color = 'Red'
      color = 'White'
      //bgc = 'Black'
      bgc = 'Red'
      break
    case 'start':
      color = 'OliveDrab'
      bgc = 'PaleGreen'
      break
    case 'warning':
      color = 'Tomato'
      bgc = 'Yellow'
      break
    case 'end':
      color = 'Orchid'
      bgc = 'MediumVioletRed'
      break
    default:
      color = 'Black'
      bgc = 'White'
  }

  if (typeof msg == 'object') {
    console.log(msg)
  } else if (typeof color == 'object') {
    console.log('%c' + msg, 'color: PowderBlue;font-weight:bold; background-color: RoyalBlue;')
    console.log(color)
  } else {
    console.log('%c' + msg, 'color:' + color + ';font-weight:bold; background-color: ' + bgc + ';')
  }
}

export const alertStore = defineStore('Alert', {
  state: () => ({
    type: 0,
    message: ''
  }),
  actions: {
    add(_message: string, _type: number = 1) {
      this.message = _message
      this.type = _type

      if (_type == 1) {
        log('Info: ' + _message, 'info')
      } else if (_type == 2) {
        log('Error: ' + _message, 'error')
      } else if (_type == 3) {
        log('Success: ' + _message, 'success')
      } else if (_type == 4) {
        log('Warn: ' + _message, 'warning')
      }

      setTimeout(() => {
        this.message = ''
        this.type = 0
      }, 4000)
    },
    hide() {
      this.type = 0
    },
    log(_msg: string, _type: string = 'info') {
      log(_msg, _type)
    },
    info(_msg: string) {
      this.add(_msg, 1)
    },
    error(_msg: string) {
      this.add(_msg, 2)
    },
    success(_msg: string) {
      this.add(_msg, 3)
    },
    warn(_msg: string) {
      this.add(_msg, 4)
    }
  }
})
