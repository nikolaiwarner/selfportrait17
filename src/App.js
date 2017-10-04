import 'aframe'
import 'aframe-chromakey-material'
import {Scene} from 'aframe-react'
import Fullscreen from 'react-html5-fullscreen'
import React, { Component } from 'react'
import uuid from 'uuid/v4'
import {sortBy} from 'lodash'

import './App.css'

const ONE_SECOND = 1000

class App extends Component {
  constructor () {
    super()
    this.state = {
      items: [],
      stories: [{
        items: [
          {src: 'background1', minScaleX: 100, maxScaleX: 110, minPosZ: -25, maxPosZ: -28},
          {src: 'background1', minScaleX: 100, maxScaleX: 110, minPosZ: -21, maxPosZ: -22},
          {src: 'smoke'},
          {src: 'smoke'},
          {src: 'smoke'},
          {src: 'smoke'},
          {src: 'character1', minPosZ: -15, maxPosZ: -20},
          {src: 'character1', minScaleX: 20, maxScaleX: 20, minScaleY: 25, maxScaleY: 25, minPosX: -2, maxPosX: 0, minPosY: 0, maxPosY: 3, minPosZ: -10, maxPosZ: -15}
        ]
      }, {
        items: [
          {src: 'self2', color: '0.5 0.5 0.5'},
          {src: 'self2', color: '0.5 0 0.5'},
          {src: 'self2', minPosZ: -20, maxPosZ: -25},
          {src: 'self2', color: '0.5 0.5 0.5'},
          {src: 'self2', color: '0.5 0 0.5'},
          {src: 'self2', minPosZ: -20, maxPosZ: -25},
          {src: 'self1', minScaleX: 20, maxScaleX: 30, minScaleY: 20, maxScaleY: 30, minPosX: 0, maxPosX: 0, minPosY: 0, maxPosY: 0, minPosZ: -10, maxPosZ: -15},
          {src: 'self1', minPosZ: -15}
        ]
      }, {
        items: [
          {src: 'outside2', minScaleX: 100, maxScaleX: 110, minPosZ: -21, maxPosZ: -22},
          {src: 'outside2', minScaleX: 100, maxScaleX: 110, minPosZ: -21, maxPosZ: -28},
          {src: 'outside1', minScaleX: 50, maxScaleX: 50, minScaleY: 50, maxScaleY: 50, minPosX: 0, maxPosX: 0, minPosY: 0, maxPosY: 0, minPosZ: -10, maxPosZ: -15},
          {src: 'outside1'},
          {src: 'outside1'},
          {src: 'outside3', minScaleX: 50, maxScaleX: 50, minScaleY: 75, maxScaleY: 75, minPosZ: -18, maxPosZ: -19},
          {src: 'outside3', minScaleX: 50, maxScaleX: 50, minScaleY: 75, maxScaleY: 75, minPosZ: -18, maxPosZ: -19}
        ]
      }],
      videos: [
        {id: 'background1', src: 'b1.mp4'},
        {id: 'character1', src: '1.mp4'},
        {id: 'smoke', src: 'smoke1.mp4'},
        {id: 'self1', src: 'self1.mp4'},
        {id: 'self2', src: 'self2.mp4'},
        {id: 'outside1', src: 'outside1.mp4'},
        {id: 'outside2', src: 'outside2.mp4'},
        {id: 'outside3', src: 'outside3.mp4'}
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
    if (storyId === 0) {
      this.setState({showTitle: true})
      setTimeout(() => {
        this.setState({showTitle: false})
      }, 10 * ONE_SECOND)
    }
    let timeout = 60 * ONE_SECOND + (this.randomInt(-10, 10) * ONE_SECOND)
    setTimeout(this.playStory.bind(this, storyId + 1), timeout)
    this.state.stories[storyId].items.forEach((item) => {
      setTimeout(() => {
        const id = uuid()
        this.setState((state) => {
          item.id = id
          item.scale = `${this.randomInt(item.minScaleX || 50, item.maxScaleX || 100)} ${this.randomInt(item.minScaleY || 50, item.maxScaleY || 100)} 0`
          let positionZ = this.randomInt(item.minPosZ || -20, item.maxPosZ || -1)
          item.positionZ = positionZ
          item.position = `${this.randomInt(item.minPosX || -10, item.maxPosX || 10)} ${this.randomInt(item.minPosY || -2, item.maxPosY || 2)} ` + positionZ
          let items = [...state.items, item]
          // The chromakeying requires elements to be stacked in Z order to see through an element
          items = sortBy(items, 'positionZ').reverse()
          return {items, storyId}
        }, () => {
          setTimeout(() => {
            this.setState((state) => {
              const stateItems = state.items.filter((stateItem) => {
                return stateItem.id !== id
              })
              return {items: stateItems}
            })
          }, (this.randomInt(10, 60) * ONE_SECOND))
        })
      }, (this.randomInt(0, 10) * ONE_SECOND))
    })
  }

  render () {
    return (
      <div>
        <Scene
          embedded
          vr-mode-ui='enabled: false'
          className='scene'
        >
          <a-assets>
            {this.state.videos.map((item) => (
              <video key={item.id} autoPlay className={'video'} id={item.id} loop src={item.src} />
            ))}
          </a-assets>
          <a-sky color="#00FF00"></a-sky>
          {this.state.items.map((item) => (
            <a-entity
              key={item.id}
              geometry={'primitive: box'}
              material={`shader: chromakey; src: #${item.src}; color: ${item.color || '0 1 0'}`}
              scale={item.scale}
              position={item.position}
              rotation={`0 0 0`}
            />
          ))}
        </Scene>
        <Fullscreen
          contentEnter={<div>Enter fullscreen</div>}
          contentExit={<div />}
          target='body'
        />
        {this.state.showTitle &&
          <div className='titles'>self portrait 17 <span className='by'> nick warner</span></div>
        }
      </div>
    )
  }
}

export default App
