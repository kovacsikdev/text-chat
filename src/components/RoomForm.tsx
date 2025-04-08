import { 
  Paper, 
  Typography, 
  TextField, 
  Button, 
  Box, 
  Alert,
  CircularProgress
} from '@mui/material'

interface RoomFormProps {
  username: string
  setUsername: (value: string) => void
  roomCode: string
  setRoomCode: (value: string) => void
  isCreatingRoom: boolean
  isJoiningRoom: boolean
  error: string | null
  handleCreateRoom: () => void
  handleJoinRoom: () => void
}

const RoomForm = ({
  username,
  setUsername,
  roomCode,
  setRoomCode,
  isCreatingRoom,
  isJoiningRoom,
  error,
  handleCreateRoom,
  handleJoinRoom
}: RoomFormProps) => {
  return (
    <Paper sx={{ p: 3, mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        {isCreatingRoom ? 'Creating Room...' : isJoiningRoom ? 'Joining Room...' : 'Join or Create a Chat Room'}
      </Typography>
      
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      
      <TextField
        label="Your Name"
        variant="outlined"
        fullWidth
        margin="normal"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        disabled={isCreatingRoom || isJoiningRoom}
      />
      
      {!isCreatingRoom && !isJoiningRoom && (
        <>
          <Button 
            variant="contained" 
            color="primary" 
            fullWidth 
            sx={{ mt: 2 }}
            onClick={handleCreateRoom}
            disabled={!username.trim()}
          >
            Create Room
          </Button>
          
          <Typography variant="body2" sx={{ mt: 2, mb: 1, textAlign: 'center' }}>
            OR
          </Typography>
          
          <TextField
            label="Room Code"
            variant="outlined"
            fullWidth
            margin="normal"
            value={roomCode}
            onChange={(e) => setRoomCode(e.target.value)}
          />
          
          <Button 
            variant="contained" 
            color="secondary" 
            fullWidth 
            sx={{ mt: 2 }}
            onClick={handleJoinRoom}
            disabled={!username.trim() || !roomCode.trim()}
          >
            Join Room
          </Button>
        </>
      )}
      
      {(isCreatingRoom || isJoiningRoom) && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
          <CircularProgress />
        </Box>
      )}
    </Paper>
  )
}

export default RoomForm 