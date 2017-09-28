import 'aframe'
import 'aframe-chromakey-material'
import {Entity, Scene} from 'aframe-react'
import Fullscreen from 'react-html5-fullscreen'
import React, { Component } from 'react'

import './App.css'

class App extends Component {
  componentWillMount () {

  }

  componentDidMount () {
    document.querySelectorAll('video').forEach((video) => { video.play() })
  }

  render () {
    return (
      <div>
        <Fullscreen
          contentEnter={<a href={'#'}>Enter fullscreen</a>}
          contentExit={<div />}
          target='body'
        />
        <Scene
          embedded
          vr-mode-ui='enabled: false'
          className='scene'
          fog='type: linear; color: #AAA; near'
        >
          <a-assets>
            <video id='background1' className='video' src='b1.mp4' loop autoPlay={false} />
            <video id='background2' className='video' src='b2.mp4' loop autoPlay={false} />
            <video id='character1' className='video' src='1.mp4' loop autoPlay={false} />

            <video id='smoke' className='video' src='smoke1.mp4' loop autoPlay={false} />
          </a-assets>
          <Entity geometry='primitive: box' material='shader: chromakey; src: #background1; color: 1 0 0' scale='100 50 0' position='0 0 -20' rotation='0 0 0' />

          <Entity geometry='primitive: box' material='shader: chromakey; src: #smoke; color: 0.0 1 0.0' scale='100 50 0' position='-10 1.5 -10' rotation='0 0 0' />

          <Entity geometry='primitive: box' material='shader: chromakey; src: #character1; color: 0.0 0.9 0.1' scale='2.5 3 0' position='0 1.5 -2' rotation='0 0 0' />

        </Scene>
      </div>
    )
  }
}

export default App
