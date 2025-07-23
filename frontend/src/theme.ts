import { createTheme } from '@mantine/core';

export const theme = createTheme({
  /** Put your mantine theme override here */
  breakpoints: {
    base: '0', // default
    xxs: '375px', // 375px
    xs: '33em', // 528px
    sm: '48em', // 768px
    md: '64em', // 1024px
    lg: '75em', // 1200px
    xl: '90em', // 1440px
  },
});
