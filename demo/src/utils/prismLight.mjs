/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

// Handle different prism-react-renderer versions and environments
let lightTheme;
try {
  const { themes } = require("prism-react-renderer");
  lightTheme = themes.github || themes.oneLight;
} catch (error) {
  // Fallback for older versions or build issues
  console.warn(
    "Failed to load prism-react-renderer themes, using fallback:",
    error.message
  );
  lightTheme = {
    plain: {
      color: "#24292e",
      backgroundColor: "#ffffff",
    },
    styles: [],
  };
}

const theme = {
  ...lightTheme,
  styles: [
    ...lightTheme.styles,
    {
      types: ["title"],
      style: {
        color: "#0550AE",
        fontWeight: "bold",
      },
    },
    {
      types: ["parameter"],
      style: {
        color: "#953800",
      },
    },
    {
      types: ["boolean", "rule", "color", "number", "constant", "property"],
      style: {
        color: "#005CC5",
      },
    },
    {
      types: ["atrule", "tag"],
      style: {
        color: "#22863A",
      },
    },
    {
      types: ["script"],
      style: {
        color: "#24292E",
      },
    },
    {
      types: ["operator", "unit", "rule"],
      style: {
        color: "#D73A49",
      },
    },
    {
      types: ["font-matter", "string", "attr-value"],
      style: {
        color: "#C6105F",
      },
    },
    {
      types: ["class-name"],
      style: {
        color: "#116329",
      },
    },
    {
      types: ["attr-name"],
      style: {
        color: "#0550AE",
      },
    },
    {
      types: ["keyword"],
      style: {
        color: "#CF222E",
      },
    },
    {
      types: ["function"],
      style: {
        color: "#8250DF",
      },
    },
    {
      types: ["selector"],
      style: {
        color: "#6F42C1",
      },
    },
    {
      types: ["variable"],
      style: {
        color: "#E36209",
      },
    },
    {
      types: ["comment"],
      style: {
        color: "#6B6B6B",
      },
    },
  ],
};

export default theme;
