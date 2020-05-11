const { createMuiTheme } = require("@material-ui/core");

const theme = createMuiTheme({
  palette: {
    type: 'dark',
  },
  typography: {
    h5: {
      fontSize: '1rem'
    }
  }
});

export default theme;