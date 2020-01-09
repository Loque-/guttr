# Guttr

Utility for UI developers using OOCSS to return consistent gutters without having to use a grid system.


## Install

`yarn add guttr`


## Usage

Import guttr, configure it and export it for use across the project.


Configuration example;

```js
import { guttr } from 'guttr';

const siteGutter = guttr({
    base: {
        gutter: 16
    },
    breakpoints: {
        small: {
            gutter: 16,
            mediaQuery: `@media(min-width: 768px)`
        },
        medium: {
            gutter: 16,
            mediaQuery: `@media(min-width: 992px)`
        },
        large: {
            gutter: 28,
            mediaQuery: `@media(min-width: 1300px)`
        }
    }
})

export default siteGutter;

```

Usage example;

```js
import siteGutter from 'path/to/config';

// Returns standard gutter from config
siteGutter()

// Override percentage of gutter being used for all breakpoints
siteGutter({ top: 1})

// Override percentage of gutter being used for a breakpoint (defined in the configuration) until reset
siteGutter({}, { small: { top: 1 }, large: { top: 0.5 } })

```

## Why

Grid systems are great but the fundemental qaulity is the gutters, this function allows us to manage multiple contexts for spacing (I'd recommend no more than 2) without implementing an entire grid system.

I originally created this functionality in a mixin for SCSS before moving full time to ReactJS, I immediately re-created it in JS and have used it on every project since.

## Improvements

- Guttr only returns `px` values currently and should really return a configured metric
