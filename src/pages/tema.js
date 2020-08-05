import { createMuiTheme } from '@material-ui/core/styles'

export const theme = createMuiTheme({
    palette: {
        primary: {
            main: '#f1faee',
        },
        secondary: {
            main: '#d24b33',
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
                color: 'white'
            }
        },
        MuiInputLabel: {
            root: {
                fontSize: '18px',
                color: 'white'
            },
        },
    },
});