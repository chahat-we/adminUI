import React from 'react'
import loader from '../images/loader-light.png'
function Loading() {
  return (
    <div style={{height:'100vh', backgroundColor:"#212121"}}>
      <div className='loader' >
        <img src={loader} style={{width: '100%'}} alt="loading...." />
      </div>
    </div>
  )
}

export default Loading