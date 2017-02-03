const electron = require('electron')

const { remote } = electron

class NotificationView {
  constructor (title,options) {
    this.element = document.getElementById('notification')
    this.iconEl = document.getElementById('icon')
    this.titleEl = document.getElementById('title')
    this.messageEl = document.getElementById('msg')
    this.closeEl = document.getElementById('close');
    this.title = title;
    this.options = options;
  }

  render () {
    this.titleEl.innerHTML = this.title || "Notification title";
    this.iconEl.src = this.options.icon || 'electron.png'
    if (this.options.message) {
      this.messageEl.innerHTML = this.options.message
    } else {
      const parent = this.messageEl.parentElement
      parent.classList.add('onlyTitle')
      parent.removeChild(this.messageEl)
    }
    if(this.options.sound){
      // Check if file is accessible
      try {
        // If it's a local file, check it's existence
        // Won't check remote files e.g. http://
        if (this.options.sound.match(/^file\:/) !== null
        || this.options.sound.match(/^\//) !== null) {
          let audio = new global.window.Audio(this.options.sound)
          audio.play()
        }
      } catch (e) {
        log('electron-notify: ERROR could not find sound file: ' + notificationObj.sound.replace('file://', ''), e, e.stack)
      }
    }
    this.setupClose();
    this.setupNotifier()
  }
  setupClose(){
    this.closeEl.addEventListener('click',(event) =>{
      const mainWindow = remote.getCurrentWindow()
      mainWindow.emit('onClose', event.target.innerHTML)
      mainWindow.close();
    });
  }
  setupNotifier () {
    this.element.addEventListener('click',(event) =>{
      const mainWindow = remote.getCurrentWindow()
        mainWindow.emit('clicked', event.target.innerHTML)
    });
  }  
}

module.exports = NotificationView
