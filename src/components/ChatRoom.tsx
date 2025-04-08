import { 
  Paper, 
  Box, 
  Typography, 
  Button, 
  Divider, 
  List, 
  ListItem,
  TextField,
  Avatar,
  useTheme
} from '@mui/material'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import ExitToAppIcon from '@mui/icons-material/ExitToApp'
import { useRef, useEffect } from 'react'
import { Message } from '../types'

interface ChatRoomProps {
  roomCode: string
  messages: Message[]
  input: string
  setInput: (value: string) => void
  handleSendMessage: (e: React.FormEvent) => void
  handleCopyRoomCode: () => void
  handleLeaveRoom: () => void
  isLoading: boolean
  username: string
}

const ChatRoom = ({
  roomCode,
  messages,
  input,
  setInput,
  handleSendMessage,
  handleCopyRoomCode,
  handleLeaveRoom,
  isLoading,
  username
}: ChatRoomProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const theme = useTheme()
  const isDarkMode = theme.palette.mode === 'dark'

  // Scroll to bottom whenever messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Get initials for avatar
  const getInitials = (name: string) => {
    return name.charAt(0).toUpperCase()
  }

  // Theme-aware colors
  const chatBackgroundColor = isDarkMode ? '#1e1e1e' : '#f0f2f5'
  const ownMessageColor = isDarkMode ? '#005c4b' : '#DCF8C6'
  const otherMessageColor = isDarkMode ? '#262d31' : 'white'
  const ownAvatarColor = isDarkMode ? '#128C7E' : '#128C7E'
  const otherAvatarColor = isDarkMode ? '#075E54' : '#075E54'
  const textColor = isDarkMode ? '#e9edef' : 'inherit'
  const secondaryTextColor = isDarkMode ? '#8696a0' : 'text.secondary'

  return (
    <Paper sx={{ p: 3, mb: 3, display: 'flex', flexDirection: 'column', flex: 1 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">
          Room: {roomCode}
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button 
            variant="outlined" 
            startIcon={<ContentCopyIcon />}
            onClick={handleCopyRoomCode}
          >
            Copy Code
          </Button>
          <Button 
            variant="outlined" 
            color="error"
            startIcon={<ExitToAppIcon />}
            onClick={handleLeaveRoom}
          >
            Leave Room
          </Button>
        </Box>
      </Box>
      
      <Divider sx={{ mb: 2 }} />
      
      <Box sx={{ 
        flex: 1, 
        overflowY: 'auto', 
        mb: 2, 
        bgcolor: chatBackgroundColor, 
        p: 2, 
        borderRadius: 1,
        color: textColor,
        minHeight: '200px', // Set a minimum height for the message list
        maxHeight: '400px' // Set a maximum height for the message list
      }}>
        <List sx={{ p: 0 }}>
          {messages.map((message) => {
            const isOwnMessage = message.sender === username
            return (
              <ListItem 
                key={message.id} 
                sx={{ 
                  display: 'flex', 
                  flexDirection: isOwnMessage ? 'row-reverse' : 'row',
                  alignItems: 'flex-start',
                  px: 0,
                  py: 1
                }}
              >
                <Avatar 
                  sx={{ 
                    bgcolor: isOwnMessage ? ownAvatarColor : otherAvatarColor,
                    width: 32,
                    height: 32,
                    fontSize: '0.875rem',
                    mr: isOwnMessage ? 0 : 1,
                    ml: isOwnMessage ? 1 : 0
                  }}
                >
                  {getInitials(message.sender)}
                </Avatar>
                <Box 
                  sx={{ 
                    maxWidth: '70%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: isOwnMessage ? 'flex-end' : 'flex-start'
                  }}
                >
                  <Typography 
                    variant="caption" 
                    sx={{ 
                      color: secondaryTextColor,
                      mb: 0.5,
                      ml: isOwnMessage ? 0 : 1,
                      mr: isOwnMessage ? 1 : 0
                    }}
                  >
                    {message.sender}
                  </Typography>
                  <Box 
                    sx={{ 
                      bgcolor: isOwnMessage ? ownMessageColor : otherMessageColor,
                      p: 1.5,
                      borderRadius: 2,
                      boxShadow: isDarkMode ? '0 1px 2px rgba(0,0,0,0.3)' : '0 1px 2px rgba(0,0,0,0.1)',
                      position: 'relative',
                      '&:after': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        [isOwnMessage ? 'right' : 'left']: -8,
                        width: 0,
                        height: 0,
                        borderTop: '8px solid transparent',
                        borderBottom: '8px solid transparent',
                        [isOwnMessage ? 'borderLeft' : 'borderRight']: `8px solid ${isOwnMessage ? ownMessageColor : otherMessageColor}`
                      }
                    }}
                  >
                    <Typography variant="body1" sx={{ color: textColor }}>
                      {message.content}
                    </Typography>
                  </Box>
                  <Typography 
                    variant="caption" 
                    sx={{ 
                      color: secondaryTextColor,
                      mt: 0.5,
                      ml: isOwnMessage ? 0 : 1,
                      mr: isOwnMessage ? 1 : 0
                    }}
                  >
                    {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </Typography>
                </Box>
              </ListItem>
            )
          })}
          <div ref={messagesEndRef} /> {/* Keeps the scroll at the bottom */}
        </List>
      </Box>
      
      <form onSubmit={handleSendMessage}>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Type a message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <Button 
            type="submit" 
            variant="contained" 
            color="primary"
            disabled={!input.trim() || isLoading}
          >
            Send
          </Button>
        </Box>
      </form>
    </Paper>
  )
}

export default ChatRoom