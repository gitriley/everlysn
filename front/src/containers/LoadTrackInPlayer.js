import React from 'react'
import { connect } from 'react-redux'
import { loadTrackInPlayer } from '../actions'
const LoadTrackInPlayer = ({ dispatch, trackId }) => {
  let input

  return (
    <div>      
      <button 
        onClick={e => {
          e.preventDefault()          
          dispatch(loadTrackInPlayer(trackId))
        }}

      >Load track in audio player</button>
    </div>
  )
}

export default connect()(LoadTrackInPlayer)