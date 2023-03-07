import { extendTheme, ThemeConfig } from "@chakra-ui/react";
import { closeButtonTheme } from "./CloseButton";

import { DM_Sans } from "@next/font/google";

const config: ThemeConfig = {
  initialColorMode: "dark",
  useSystemColorMode: false,
};

const font_primary = DM_Sans({
  weight: ["400"],
  subsets: ["latin"],
});

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
    fonts: {
      body: font_primary.style.fontFamily,
      heading: font_primary.style.fontFamily,
    },

    components: {
      CloseButton: closeButtonTheme,
    },
  }
);

export default theme;
