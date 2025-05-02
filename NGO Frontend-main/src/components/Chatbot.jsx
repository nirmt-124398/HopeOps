import React, { useState, useEffect, useRef } from 'react'
// Import Botpress components only if needed
import { Fab, Webchat } from '@botpress/webchat'

// Create a wrapper component to silence the defaultProps warning
const BotpressWebchat = ({ clientId, style, ...props }) => {
  return <Webchat clientId={clientId} style={style} {...props} />
}

const BotpressFab = ({ onClick, style, ...props }) => {
  return <Fab onClick={onClick} style={style} {...props} />
}

const Chatbot = () => {
  const [isWebchatOpen, setIsWebchatOpen] = useState(false)
  const [isWebchatReady, setIsWebchatReady] = useState(false)
  const chatRef = useRef(null)
  
  const toggleWebchat = () => {
    setIsWebchatOpen(prevState => !prevState)
  }

  // Initialize Webchat properly
  useEffect(() => {
    // Make sure the component is mounted before initializing
    const timer = setTimeout(() => {
      setIsWebchatReady(true)
    }, 1000)
    
    return () => clearTimeout(timer)
  }, [])

  return (
    <div style={{ position: 'relative', zIndex: 9999 }} ref={chatRef}>
      {isWebchatReady && (
        <div style={{ position: 'relative' }}>
          <BotpressWebchat
            clientId="3be55b43-523a-4d6c-a554-1c83f534dc37" 
            style={{
              width: '400px',
              height: '600px',
              display: isWebchatOpen ? 'flex' : 'none',
              position: 'fixed',
              bottom: '90px',
              right: '20px',
              zIndex: 9999,
              maxWidth: '90vw',
              maxHeight: '70vh',
              boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
              borderRadius: '10px',
              overflow: 'hidden'
            }}
          />
        </div>
      )}
      
      <BotpressFab
        onClick={toggleWebchat}
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          width: '60px',
          height: '60px',
          zIndex: 9999
        }}
      />
    </div>
  )
}

export default Chatbot