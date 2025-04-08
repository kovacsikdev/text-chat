import { useState, useEffect } from 'react'
import { Box, Container, ThemeProvider, createTheme, Snackbar, Alert } from '@mui/material'
import { io, Socket } from 'socket.io-client'
import WelcomeModal from './components/WelcomeModal'
import AppHeader from './components/AppHeader'
import RoomForm from './components/RoomForm'
import ChatRoom from './components/ChatRoom'
import { Message, ChatRoom as ChatRoomType } from './types'

interface ToastMessage {
  message: string
  severity: 'info' | 'success' | 'warning' | 'error'
}

function App() {
  const [darkMode, setDarkMode] = useState(false)
  const [socket, setSocket] = useState<Socket | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [username, setUsername] = useState('')
  const [chatRoom, setChatRoom] = useState<ChatRoomType | null>(null)
  const [isCreatingRoom, setIsCreatingRoom] = useState(false)
  const [roomCode, setRoomCode] = useState('')
  const [isJoiningRoom, setIsJoiningRoom] = useState(false)
  const [showWelcomeModal, setShowWelcomeModal] = useState(true)
  const [dontShowAgain, setDontShowAgain] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [toast, setToast] = useState<ToastMessage | null>(null)

  // Create theme based on dark mode preference
  const theme = createTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light',
    },
  })

  // Initialize socket connection
  useEffect(() => {
    const newSocket = io('http://localhost:3001')
    setSocket(newSocket)

    return () => {
      newSocket.disconnect()
    }
  }, [])

  // Set up socket event listeners
  useEffect(() => {
    if (!socket) return

    socket.on('message', (message: Message) => {
      setMessages(prev => [...prev, message])
    })

    socket.on('roomJoined', (room: ChatRoomType) => {
      setChatRoom(room)
      setMessages(room.messages)
      setIsJoiningRoom(false)
      setError(null)
      
      // Show toast when joining a room
      setToast({
        message: `You joined room: ${room.code}`,
        severity: 'success'
      })
    })

    socket.on('roomCreated', (room: ChatRoomType) => {
      setChatRoom(room)
      setRoomCode(room.code)
      setIsCreatingRoom(false)
      setError(null)
      
      // Show toast when creating a room
      setToast({
        message: `You created room: ${room.code}`,
        severity: 'success'
      })
    })

    socket.on('error', (data: { message: string }) => {
      setError(data.message)
      setIsJoiningRoom(false)
      
      // Show error toast
      setToast({
        message: data.message,
        severity: 'error'
      })
    })

    socket.on('userJoined', (data: { username: string }) => {
      setToast({
        message: `${data.username} joined the room`,
        severity: 'info'
      })
    })

    socket.on('userLeft', (data: { username: string }) => {
      setToast({
        message: `${data.username} left the room`,
        severity: 'info'
      })
    })

    socket.on('hostLeft', (data: { message: string }) => {
      setToast({
        message: data.message,
        severity: 'warning'
      })
      
      // Reset chat room state
      setChatRoom(null)
      setMessages([])
      setRoomCode('')
    })

    return () => {
      socket.off('message')
      socket.off('roomJoined')
      socket.off('roomCreated')
      socket.off('error')
      socket.off('userJoined')
      socket.off('userLeft')
      socket.off('hostLeft')
    }
  }, [socket])

  // Check if welcome modal should be shown
  useEffect(() => {
    const hideModal = localStorage.getItem('hideWelcomeModal')
    if (hideModal === 'true') {
      setShowWelcomeModal(false)
    }
  }, [])

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme')
    if (savedTheme === 'dark') {
      setDarkMode(true)
    }
  }, [])

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode
    setDarkMode(newDarkMode)
    localStorage.setItem('theme', newDarkMode ? 'dark' : 'light')
  }

  const handleCopyRoomCode = () => {
    navigator.clipboard.writeText(roomCode)
    setToast({
      message: 'Room code copied to clipboard',
      severity: 'success'
    })
  }

  const handleCreateRoom = () => {
    if (!username.trim()) return
    setIsCreatingRoom(true)
    setError(null)
    socket?.emit('createRoom', { username })
  }

  const handleJoinRoom = () => {
    if (!username.trim() || !roomCode.trim()) return
    setIsJoiningRoom(true)
    setError(null)
    socket?.emit('joinRoom', { username, roomCode })
  }

  const handleLeaveRoom = () => {
    if (!socket || !chatRoom) return
    
    socket.emit('leaveRoom', { roomCode: chatRoom.code })
    
    // Reset chat room state
    setChatRoom(null)
    setMessages([])
    setRoomCode('')
    
    setToast({
      message: 'You left the room',
      severity: 'info'
    })
  }

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || !socket || !chatRoom) return

    setIsLoading(true)
    const message: Message = {
      id: Date.now().toString(),
      sender: username,
      content: input,
      timestamp: Date.now()
    }

    socket.emit('message', { message, roomCode: chatRoom.code })
    setInput('')
    setIsLoading(false)
  }

  const handleModalClose = () => {
    if (dontShowAgain) {
      localStorage.setItem('hideWelcomeModal', 'true')
    }
    setShowWelcomeModal(false)
  }

  const handleCloseToast = () => {
    setToast(null)
  }

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{
        bgcolor: 'background.default',
        color: 'text.primary',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <WelcomeModal 
          open={showWelcomeModal} 
          onClose={handleModalClose} 
          dontShowAgain={dontShowAgain} 
          setDontShowAgain={setDontShowAgain} 
        />

        <AppHeader 
          darkMode={darkMode} 
          toggleDarkMode={toggleDarkMode} 
        />

        <Container maxWidth="md" sx={{ 
          mt: 4, 
          mb: 4,
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          minWidth: { xs: '100%', sm: '600px' },
          width: '100%'
        }}>
          {!chatRoom ? (
            <RoomForm 
              username={username}
              setUsername={setUsername}
              roomCode={roomCode}
              setRoomCode={setRoomCode}
              isCreatingRoom={isCreatingRoom}
              isJoiningRoom={isJoiningRoom}
              error={error}
              handleCreateRoom={handleCreateRoom}
              handleJoinRoom={handleJoinRoom}
            />
          ) : (
            <ChatRoom 
              roomCode={chatRoom.code}
              messages={messages}
              input={input}
              setInput={setInput}
              handleSendMessage={handleSendMessage}
              handleCopyRoomCode={handleCopyRoomCode}
              handleLeaveRoom={handleLeaveRoom}
              isLoading={isLoading}
              username={username}
            />
          )}
        </Container>
        
        <Snackbar 
          open={!!toast} 
          autoHideDuration={3000} 
          onClose={handleCloseToast}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert onClose={handleCloseToast} severity={toast?.severity || 'info'} sx={{ width: '100%' }}>
            {toast?.message}
          </Alert>
        </Snackbar>
      </Box>
    </ThemeProvider>
  )
}

export default App
