import { defineStyle, defineStyleConfig } from '@chakra-ui/styled-system';

const sizes = {
  xl: defineStyle({
    fontSize: '10px',
    fontWeight: 'bold',
    px: 1.5,
    h: '6',
    borderRadius: 'md'
  })
};

export const closeButtonTheme = defineStyleConfig({
  sizes
});
