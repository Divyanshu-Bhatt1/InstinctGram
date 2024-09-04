import React from 'react'
import loading from './images/loading.gif'

export default function Spinner() {

    const divStyle = {
              margin:'0 440px',
              backgroundColor:'transparent',
              height:'50px',
              width:'50px'
    };

  return (
    <center>
    <div >
      <img className='spin' style={divStyle} src={loading} alt="Loading" ></img>
    </div>
    </center>
  )
}
