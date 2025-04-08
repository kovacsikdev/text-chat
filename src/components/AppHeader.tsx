import { 
  AppBar, 
  Toolbar, 
  Typography, 
  IconButton 
} from '@mui/material'
import Brightness4Icon from '@mui/icons-material/Brightness4'
import Brightness7Icon from '@mui/icons-material/Brightness7'

interface AppHeaderProps {
  darkMode: boolean
  toggleDarkMode: () => void
}

const AppHeader = ({ darkMode, toggleDarkMode }: AppHeaderProps) => {
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Chat Rooms
        </Typography>
        <IconButton onClick={toggleDarkMode} color="inherit">
          {darkMode ? <Brightness7Icon /> : <Brightness4Icon />}
        </IconButton>
      </Toolbar>
    </AppBar>
  )
}

export default AppHeader 