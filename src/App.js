import 'aframe'
import 'aframe-chromakey-material'
import {Entity, Scene} from 'aframe-react'
import Fullscreen from 'react-html5-fullscreen'
import React, { Component } from 'react'
import uuid from 'uuid/v4'

import './App.css'

class App extends Component {
  constructor () {
    super()
    this.state = {
      items: [],
      items2: new Map(),
      stories: [{
        items: [
          {src: 'smoke'},{src: 'smoke'},{src: 'smoke'},{src: 'smoke'},{src: 'smoke'},{src: 'smoke'},{src: 'smoke'},{src: 'smoke'},{src: 'smoke'},
          {src: 'character1'},{src: 'character1'},{src: 'character1'},{src: 'character1'},{src: 'character1'},{src: 'character1'},{src: 'character1'},{src: 'character1'},{src: 'character1'},{src: 'character1'},{src: 'character1'},{src: 'character1'},
        ]
      }, {
        items: [
          {src: 'smoke'},
          {src: 'character1'}
        ]
      }, {
        items: [
          {src: 'smoke'},
          {src: 'character1'}
        ]
      }, {
        items: [
          {src: 'smoke'},
          {src: 'character1'}
        ]
      }],
      videos: [
        {id: 'background1', src: 'b1.mp4'},
        {id: 'character1', src: '1.mp4'},
        {id: 'smoke', src: 'smoke1.mp4'}
      ]
    }
  }

  componentWillMount () {
    this.playStory(0)
  }

  componentDidMount () {
    document.querySelectorAll('video').forEach((video) => { video.play() })
  }

  randomInt (min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min
  }

  playStory (storyId) {
    if (storyId === this.state.stories.length) {
      storyId = 0
    }
    let timeout = 60 * 1000 + (this.randomInt(-30, 30) * 1000)
    setTimeout(this.playStory.bind(this, storyId + 1), timeout)
    this.state.stories[storyId].items.forEach((item) => {
      setTimeout(() => {
        const id = uuid()
        this.setState((state) => {
          item.id = id
          const items = [...state.items, item]
          return {items}
        }, () => {
          setTimeout(() => {
            this.setState((state) => {
              const stateItems = state.items.filter((stateItem) => {
                return stateItem.id !== id
              })
              return {items: stateItems}
            })
          }, (this.randomInt(10, 60) * 1000))
        })
      }, (this.randomInt(0, 30) * 1000))
    })
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
            {this.state.videos.map((item) => (
              <video key={item.id} autoPlay className={'video'} id={item.id} loop src={item.src} />
            ))}
          </a-assets>
          {this.state.items.map((item) => (
            <a-entity
              key={item.id}
              geometry={'primitive: box'}
              material={`shader: chromakey; src: #${item.src}; color: ${item.color || '0 1 0'}`}
              scale={`${this.randomInt(75, 100)} ${this.randomInt(75, 100)} 0`}
              position={`${this.randomInt(-10, 10)} ${this.randomInt(-2, 2)} ${this.randomInt(-20, -1)}`}
              rotation={`0 0 0`}
            />
          ))}
        </Scene>
      </div>
    )
  }
}

export default App
