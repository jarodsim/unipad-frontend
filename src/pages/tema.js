import { createMuiTheme } from '@material-ui/core/styles'
import { blue } from '@material-ui/core/colors'


export const theme = createMuiTheme({
    palette: {
        primary: {
            main: blue[500],
        },
        secondary: {
            main: '#1976d2',
        },
    },
    typography: {
        fontFamily: 'Montserrat'
    },
    shape: {
        borderRadius: 4
    },
    overrides: {
        MuiOutlinedInput: {
            root: {
                backgroundColor: 'transparent',
            }
        },
        MuiInputLabel: {
            root: {
                fontSize: '18px',
                color: 'white'
            }
        },
    },
});