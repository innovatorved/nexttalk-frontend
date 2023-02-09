import { extendTheme, ThemeConfig } from "@chakra-ui/react";
import { closeButtonTheme } from "./CloseButton";

const config: ThemeConfig = {
  initialColorMode: "dark",
  useSystemColorMode: false,
};

const theme = extendTheme(
  {
    config,
  },
  {
    colors: {
      brand: {
        100: "#3d84f7",
      },
    },

    styles: {
      global: () => ({
        body: {
          bg: "whiteAlpha.200",
        },
      }),
    },

    components: {
      CloseButton: closeButtonTheme,
    },
  }
);

export default theme;
