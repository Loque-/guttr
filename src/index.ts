import isEqual from 'lodash/isEqual'

type Unit = 'px' | 'em' | 'rem' | '%' | 'vh' | 'vw'

interface GutterPadding {
  top?: number
  right?: number
  bottom?: number
  left?: number
}

interface Multipliers {
  top?: number
  right?: number
  bottom?: number
  left?: number
}

interface BuildPaddingConfig {
  gutter?: number
  unit?: Unit
  multipliers?: Multipliers
}

export interface GuttrConfig {
  base: {
    gutter?: number
    unit?: Unit
    multipliers?: GutterPadding
  }
  breakpoints?: {
    [key: string]: {
      gutter?: number
      unit?: Unit
      mediaQuery: string
    }
  }
}

export interface GuttrBreakpoints {
  [key: string]: GutterPadding
}

interface GenerateGutterConfig {
  config?: GuttrConfig
  baseMultipliers?: GutterPadding
  breakpointMultipliers?: any
}

const DEFAULT_CONFIG: GuttrConfig = {
  base: {
    gutter: 16,
    unit: 'px',
    multipliers: { top: 0.5, right: 0.5, bottom: 0.5, left: 0.5 },
  },
  breakpoints: {
    // Expected style of config
    // small: {
    //     gutter: 16,
    //     mediaQuery: `@media(min-width: 768px)`
    // },
    // medium: {
    //     gutter: 16,
    //     mediaQuery: `@media(min-width: 992px)`
    // },
    // large: {
    //     gutter: 28,
    //     mediaQuery: `@media(min-width: 1300px)`
    // }
  },
}

/**
 * @summary Creates a CSS padding compatible string value from provided gutter and object of multipliers
 * @function
 * @public
 *
 * @description
 * This function was created for the gutter CSSinJS mixin
 *
 * @param {Number} gutter - Gutter value, e.g: 20.
 * @param {Object} multipliers - an object containing a property and value pair for each required padding value
 *
 * @returns {String} A CSS compatible string value for the `padding` property
 *
 */
export function buildPadding({
  gutter = 16,
  unit = 'px',
  multipliers: { top = 0.5, right = 0.5, bottom = 0.5, left = 0.5 } = {},
}: BuildPaddingConfig = {}) {
  const pTop = gutter * top
  const pRight = gutter * right
  const pBottom = gutter * bottom
  const pLeft = gutter * left

  return `${pTop}${unit} ${pRight}${unit} ${pBottom}${unit} ${pLeft}${unit}`
}

/**
 * @summary Creates gutters, using padding, from config.breakpoints and GUTTER constants for Emotion Object syntax
 * @function
 * @requires lodash.isEqual()
 * @requires buildPadding()
 *
 * @description
 * Manage your gutters and config.breakpoints globally, allowing the spacing in your application to scale relative to these.
 *
 * @param {Object} baseMultipliers - top, right, bottom, left multiplier value, e.g: {top: 1}
 * @param {Object} breakpointMultipliers - Specific properties for specific config.breakpoints matched within your config.gutters constant, e.g: { medium: {top: 2} }
 *
 * @returns {Object} An emotion compatible object with CSS rules for padding
 *
 * @example
 * import styled from '@emotion/styled';
 * import { gutter } from 'utils/mixins';
 *
 * const SimpleExample = styled.div(
 *     {
 *         background: 'hotpink'
 *     },
 *     gutter()
 * )
 *
 * const ComplexExample = styled.div(
 *     {
 *         background: 'hotpink'
 *     },
 *     gutter(
 *         { right: 0 },
 *         {
 *             small: {
 *                 top: 0,
 *                 right: 0.5,
 *             }
 *             medium: {
 *                 top: 2,
 *             }
 *         }
 *     )
 * );
 *
 */
export function generateGutter({
  config = DEFAULT_CONFIG,
  baseMultipliers = config.base.multipliers,
  breakpointMultipliers = {},
}: GenerateGutterConfig = {}) {
  // The object we append to and return
  let gutters = {
    // Create our default padding
    padding: buildPadding({
      gutter: config.base.gutter,
      unit: config.base.unit,
      multipliers: baseMultipliers,
    }),
  }
  // A reference to the last applied padding value to avoid duplicate/unwanted rules
  let lastPad = gutters.padding
  // Last multipliers used to ensure previous breakpoint rules are preserved
  let lastMultipliers = {
    ...baseMultipliers,
  }

  // Loop through breakpoints and create padding rule if required
  for (const point in config.breakpoints) {
    const breakpointVal = config.breakpoints[point].mediaQuery
    const unitVal = config.breakpoints[point].unit || config.base.unit
    const gutterVal = config.breakpoints[point].gutter

    // If we don't have a matching gutter for that breakpoint, ignore it
    if (gutterVal === undefined) {
      continue
    }

    // Merge last used multipliers, and specific multipliers together (if there are any...)
    const multipliers = {
      ...lastMultipliers,
      ...breakpointMultipliers[point],
    }

    // Update lastMultipliers if it differs so they are carried forward to the next breakpoint
    if (isEqual(lastMultipliers, multipliers) === false) {
      lastMultipliers = { ...lastMultipliers, ...multipliers }
    }

    // Create padding for breakpoint
    const padding = buildPadding({
      gutter: gutterVal,
      unit: unitVal,
      multipliers: multipliers,
    })

    // Would be nice to do something additionally here with last rules applied, for example;
    // - If the padding value changes, but the specified override is preserved
    // console.log(padding !== lastPad, padding, lastPad, breakpointMultipliers[point]);

    // Compare against the last padding rule applied
    if (padding !== lastPad) {
      // Append gutter to gutters object
      gutters[breakpointVal] = {
        padding,
      }
    }

    // Keep track of the last padding applied
    lastPad = padding
  }

  return gutters
}

export function guttr(userConfig?: GuttrConfig) {
  return function (
    baseMultipliers?: Multipliers,
    breakpointMultipliers?: GuttrBreakpoints,
  ) {
    const localConfig = {
      // Merge base config
      base: {
        ...DEFAULT_CONFIG.base,
        ...userConfig?.base,
      },
      breakpoints: userConfig?.breakpoints,
    }

    const gutter = generateGutter.call(this, {
      config: localConfig,
      baseMultipliers,
      breakpointMultipliers,
    })
    return gutter
  }
}
