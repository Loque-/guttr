# Guttr

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT) [![codecov](https://codecov.io/gh/Loque-/guttr/branch/master/graph/badge.svg)](https://codecov.io/gh/Loque-/guttr)

Utility for UI developers using OOCSS to return consistent gutters without having to use a grid system. Allows user to configure gutter, unit and then individual breakpoints.

## Install

`npm add guttr`

## Usage

Import guttr, configure it and export it for use across the project.

Configuration example;

```js
import { guttr } from 'guttr'

const siteGutter = guttr({
  base: {
    gutter: 16,
    unit: 'px',
  },
  breakpoints: {
    small: {
      gutter: 16,
      mediaQuery: `@media(min-width: 768px)`,
    },
    medium: {
      gutter: 16,
      mediaQuery: `@media(min-width: 992px)`,
    },
    large: {
      gutter: 28,
      mediaQuery: `@media(min-width: 1300px)`,
    },
  },
})

export default siteGutter
```

Usage example;

```js
import siteGutter from 'path/to/config'

// Returns standard gutter from config
siteGutter()

// Returns gutter with an override for the top gutter used on all breakpoints
siteGutter({ top: 1 })

// Returns gutter with an override for different breakpoints defined in the example config above
siteGutter({}, { small: { top: 1 }, large: { top: 0.5, right: 1, left: 1 } })
```

## Why

Grid systems are great but the fundemental quality is the gutters, this function allows us to manage multiple contexts for spacing (I'd recommend no more than 2) without implementing an entire grid system.

I originally created this functionality in a mixin for SCSS before moving full time to ReactJS, I immediately re-created it in JS and have used it on every project since.
