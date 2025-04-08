import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions,
  Button,
  Typography,
  FormControlLabel,
  Checkbox
} from '@mui/material'

interface WelcomeModalProps {
  open: boolean
  onClose: () => void
  dontShowAgain: boolean
  setDontShowAgain: (value: boolean) => void
}

const WelcomeModal = ({ open, onClose, dontShowAgain, setDontShowAgain }: WelcomeModalProps) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle align="center">Welcome to Chat Rooms</DialogTitle>
      <DialogContent>
        <Typography align="center" sx={{ mb: 2 }}>
          A simple text messaging app where you can create or join chat rooms.
        </Typography>
        <FormControlLabel
          control={
            <Checkbox 
              checked={dontShowAgain} 
              onChange={(e) => setDontShowAgain(e.target.checked)}
            />
          }
          label="Don't show this again"
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  )
}

export default WelcomeModal 