import { guttr, generateGutter, buildPadding, GuttrConfig } from '.'

const testConfig: GuttrConfig = {
  base: {
    gutter: 16,
    unit: 'px',
    // It's unlikely the user will want to specify custom base multipliers
    // There is a test below for this instance
    // multipliers: { top: 0.5, right: 0.5, bottom: 0.5, left: 0.5 }
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
}

const expectedGutterFromTestConfig = {
  padding: '8px 8px 8px 8px',
  '@media(min-width: 1300px)': { padding: '14px 14px 14px 14px' },
}

describe('BuildPadding', () => {
  test('Builds padding string', () => {
    const generatedPadding = buildPadding()
    const expectedPadding = '8px 8px 8px 8px'
    expect(generatedPadding).toStrictEqual(expectedPadding)
  })

  test('Accepts a number for first argument', () => {
    const generatedPadding = buildPadding({ gutter: 10 })
    const expectedPadding = '5px 5px 5px 5px'
    expect(generatedPadding).toStrictEqual(expectedPadding)
  })

  test('Accepts object with values for top, right, bottom and left for the second argument', () => {
    const generatedPadding = buildPadding({
      gutter: 10,
      unit: 'px',
      multipliers: {
        top: 0.25,
        right: 1,
        bottom: 0.25,
        left: 1,
      },
    })
    const expectedPadding = '2.5px 10px 2.5px 10px'
    expect(generatedPadding).toStrictEqual(expectedPadding)
  })
})

describe('GenerateGutter', () => {
  test('Returns default padding with no config', () => {
    const generatedGutter = generateGutter()
    const expectedGutter = {
      padding: '8px 8px 8px 8px',
    }
    expect(generatedGutter).toStrictEqual(expectedGutter)
  })
})

describe('Guttr', () => {
  test('Returns default padding with no config', () => {
    const siteGutter = guttr()
    const generatedGutter = siteGutter()
    const expectedGutter = {
      padding: '8px 8px 8px 8px',
    }
    expect(generatedGutter).toStrictEqual(expectedGutter)
  })

  test('Single param with no config', () => {
    const siteGutter = guttr()
    const generatedGutter = siteGutter({ top: 1 })
    const expectedGutter = {
      padding: '16px 8px 8px 8px',
    }
    expect(generatedGutter).toStrictEqual(expectedGutter)
  })

  test('Multiple params with no config', () => {
    const siteGutter = guttr()
    const generatedGutter = siteGutter({ top: 1, right: 0.25 })
    const expectedGutter = {
      padding: '16px 4px 8px 8px',
    }
    expect(generatedGutter).toStrictEqual(expectedGutter)
  })

  test('Guttr returns expected test gutter from test config', () => {
    const siteGutter = guttr(testConfig)
    expect(siteGutter()).toStrictEqual(expectedGutterFromTestConfig)
  })

  test('Single breakpoint modifier', () => {
    const siteGutter = guttr(testConfig)
    const generatedGutter = siteGutter({}, { small: { left: 1 } })
    const expectedGutter = {
      padding: '8px 8px 8px 8px',
      '@media(min-width: 768px)': { padding: '8px 8px 8px 16px' },
      '@media(min-width: 1300px)': { padding: '14px 14px 14px 28px' },
    }

    expect(generatedGutter).toStrictEqual(expectedGutter)
  })

  test('Multiple breakpoint modifiers', () => {
    const siteGutter = guttr(testConfig)
    const generatedGutter = siteGutter(
      {},
      { small: { left: 1 }, medium: { top: 1 } },
    )
    const expectedGutter = {
      padding: '8px 8px 8px 8px',
      '@media(min-width: 768px)': { padding: '8px 8px 8px 16px' },
      '@media(min-width: 992px)': { padding: '16px 8px 8px 16px' },
      '@media(min-width: 1300px)': { padding: '28px 14px 14px 28px' },
    }

    expect(generatedGutter).toStrictEqual(expectedGutter)
  })

  test('Default and breakpoint modifiers', () => {
    const siteGutter = guttr(testConfig)
    const generatedGutter = siteGutter(
      { bottom: 0 },
      { small: { left: 1 }, medium: { top: 1 } },
    )
    const expectedGutter = {
      padding: '8px 8px 0px 8px',
      '@media(min-width: 768px)': { padding: '8px 8px 0px 16px' },
      '@media(min-width: 992px)': { padding: '16px 8px 0px 16px' },
      '@media(min-width: 1300px)': { padding: '28px 14px 0px 28px' },
    }

    expect(generatedGutter).toStrictEqual(expectedGutter)
  })

  test('Custom base multipliers', () => {
    const siteGutter = guttr({
      ...testConfig,
      base: {
        multipliers: { top: 0.25, right: 0.5, bottom: 1, left: 0.5 },
      },
    })
    const generatedGutter = siteGutter()
    const expectedGutter = {
      padding: '4px 8px 16px 8px',
      '@media(min-width: 1300px)': { padding: '7px 14px 28px 14px' },
    }
    expect(generatedGutter).toStrictEqual(expectedGutter)
  })

  test('Breakpoint with no gutter value', () => {
    const siteGutter = guttr({
      ...testConfig,
      breakpoints: {
        small: {
          gutter: 20,
          mediaQuery: `@media(min-width: 768px)`,
        },
        medium: {
          mediaQuery: `@media(min-width: 992px)`,
        },
        large: {
          gutter: 28,
          mediaQuery: `@media(min-width: 1300px)`,
        },
      },
    })
    const generatedGutter = siteGutter()
    const expectedGutter = {
      padding: '8px 8px 8px 8px',
      '@media(min-width: 768px)': { padding: '10px 10px 10px 10px' },
      '@media(min-width: 1300px)': { padding: '14px 14px 14px 14px' },
    }
    expect(generatedGutter).toStrictEqual(expectedGutter)
  })

  test('Change unit type in config', () => {
    const siteGutter = guttr({
      base: {
        gutter: 1,
        unit: 'rem',
      },
    })
    const generatedGutter = siteGutter()
    const expectedGutter = {
      padding: '0.5rem 0.5rem 0.5rem 0.5rem',
    }
    expect(generatedGutter).toStrictEqual(expectedGutter)
  })

  test('Allow different units at different breakpoints', () => {
    const siteGutter = guttr({
      base: {
        gutter: 1,
        unit: 'rem',
      },
      breakpoints: {
        small: {
          gutter: 16,
          unit: 'px',
          mediaQuery: `@media(min-width: 768px)`,
        },
        medium: {
          gutter: 4,
          mediaQuery: `@media(min-width: 992px)`,
        },
      },
    })
    const generatedGutter = siteGutter()
    const expectedGutter = {
      padding: '0.5rem 0.5rem 0.5rem 0.5rem',
      '@media(min-width: 768px)': { padding: '8px 8px 8px 8px' },
      '@media(min-width: 992px)': { padding: '2rem 2rem 2rem 2rem' },
    }
    expect(generatedGutter).toStrictEqual(expectedGutter)
  })
})
