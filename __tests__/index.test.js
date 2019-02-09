import noFlickerLoading from '../src/'

describe('noFlickerLoading', () => {
  test('does not show loading (wait < initDelay)', async () => {
    const start = Date.now()
    let isLoadingVisible = false

    await noFlickerLoading(
      async () => {
        await new Promise(resolve => setTimeout(resolve, 250))
      },
      () => {
        isLoadingVisible = true
      }
    )

    expect(isLoadingVisible).toBe(false)
    expect(Date.now() - start).toBeLessThan(300)
  })

  test('shows loading (wait > initDelay)', async () => {
    const start = Date.now()
    let isLoadingVisible = false

    await noFlickerLoading(
      async () => {
        await new Promise(resolve => setTimeout(resolve, 350))
      },
      () => {
        isLoadingVisible = true
      }
    )

    expect(isLoadingVisible).toBe(true)
    expect(Date.now() - start).toBeGreaterThan(600)
  })

  test('does not show loading (wait < initDelay, custom waits)', async () => {
    const start = Date.now()
    let isLoadingVisible = false

    await noFlickerLoading(
      async () => {
        await new Promise(resolve => setTimeout(resolve, 450))
      },
      () => {
        isLoadingVisible = true
      },
      {
        initDelay: 500,
        minWait: 500,
      }
    )

    expect(isLoadingVisible).toBe(false)
    expect(Date.now() - start).toBeLessThan(500)
  })

  test('shows loading (wait > initDelay, custom waits)', async () => {
    const start = Date.now()
    let isLoadingVisible = false

    await noFlickerLoading(
      async () => {
        await new Promise(resolve => setTimeout(resolve, 550))
      },
      () => {
        isLoadingVisible = true
      },
      {
        initDelay: 500,
        minWait: 500,
      }
    )

    expect(isLoadingVisible).toBe(true)
    expect(Date.now() - start).toBeGreaterThan(1000)
  })

  test('does not show loading (wait < initDelay, custom initDelay)', async () => {
    const start = Date.now()
    let isLoadingVisible = false

    await noFlickerLoading(
      async () => {
        await new Promise(resolve => setTimeout(resolve, 450))
      },
      () => {
        isLoadingVisible = true
      },
      {
        initDelay: 500,
      }
    )

    expect(isLoadingVisible).toBe(false)
    expect(Date.now() - start).toBeLessThan(500)
  })

  test('shows loading (wait > initDelay, custom initDelay)', async () => {
    const start = Date.now()
    let isLoadingVisible = false

    await noFlickerLoading(
      async () => {
        await new Promise(resolve => setTimeout(resolve, 550))
      },
      () => {
        isLoadingVisible = true
      },
      {
        initDelay: 500,
      }
    )

    expect(isLoadingVisible).toBe(true)
    expect(Date.now() - start).toBeGreaterThan(800)
  })

  test('does not show loading (wait < initDelay, custom minWait)', async () => {
    const start = Date.now()
    let isLoadingVisible = false

    await noFlickerLoading(
      async () => {
        await new Promise(resolve => setTimeout(resolve, 250))
      },
      () => {
        isLoadingVisible = true
      },
      {
        minWait: 500,
      }
    )

    expect(isLoadingVisible).toBe(false)
    expect(Date.now() - start).toBeLessThan(300)
  })

  test('shows loading (wait > initDelay, custom minWait)', async () => {
    const start = Date.now()
    let isLoadingVisible = false

    await noFlickerLoading(
      async () => {
        await new Promise(resolve => setTimeout(resolve, 350))
      },
      () => {
        isLoadingVisible = true
      },
      {
        minWait: 500,
      }
    )

    expect(isLoadingVisible).toBe(true)
    expect(Date.now() - start).toBeGreaterThan(800)
  })

  test('no options parameter passed', async () => {
    let error = null

    try {
      await noFlickerLoading(
        async () => {
          await new Promise(resolve => setTimeout(resolve, 350))
        },
        () => null
      )
    } catch (err) {
      error = err
    }

    expect(error).toBe(null)
  })

  test('throw when main throws (wait < initDelay)', async () => {
    let error = null

    try {
      await noFlickerLoading(
        async () => {
          await new Promise((resolve, reject) =>
            setTimeout(() => reject(new Error('An error occurred')), 250)
          )
        },
        () => null
      )
    } catch (err) {
      error = err
    }

    expect(error).not.toBe(null)
    expect(error.message).toBe('An error occurred')
  })

  test('throw when main throws (wait > initDelay)', async () => {
    let error = null

    try {
      await noFlickerLoading(
        async () => {
          await new Promise((resolve, reject) =>
            setTimeout(() => reject(new Error('An error occurred')), 350)
          )
        },
        () => null
      )
    } catch (err) {
      error = err
    }

    expect(error).not.toBe(null)
    expect(error.message).toBe('An error occurred')
  })

  test('no main function passed', async () => {
    let error = null

    try {
      await noFlickerLoading()
    } catch (err) {
      error = err
    }

    expect(error).toEqual(expect.any(Error))
    expect(error.message).toBe('first parameter `main` is required')
  })

  test('main parameter is not a function', async () => {
    let error = null

    try {
      await noFlickerLoading('foobar')
    } catch (err) {
      error = err
    }

    expect(error).toEqual(expect.any(Error))
    expect(error.message).toBe('first parameter `main` must be a function')
  })

  test('no onLoading function passed', async () => {
    let error = null

    try {
      await noFlickerLoading(async () => {
        await new Promise(resolve => setTimeout(resolve, 350))
      })
    } catch (err) {
      error = err
    }

    expect(error).toEqual(expect.any(Error))
    expect(error.message).toBe('second parameter `onLoading` is required')
  })

  test('onLoading parameter is not a function', async () => {
    let error = null

    try {
      await noFlickerLoading(async () => {
        await new Promise(resolve => setTimeout(resolve, 350))
      }, 'foobar')
    } catch (err) {
      error = err
    }

    expect(error).toEqual(expect.any(Error))
    expect(error.message).toBe(
      'second parameter `onLoading` must be a function'
    )
  })

  test('initDelay option is not a number', async () => {
    let error = null

    try {
      await noFlickerLoading(
        async () => {
          await new Promise(resolve => setTimeout(resolve, 250))
        },
        () => null,
        {
          initDelay: 'foobar',
        }
      )
    } catch (err) {
      error = err
    }

    expect(error).toEqual(expect.any(Error))
    expect(error.message).toBe('option `initDelay` must be a number')
  })

  test('minWait option is not a number', async () => {
    let error = null

    try {
      await noFlickerLoading(
        async () => {
          await new Promise(resolve => setTimeout(resolve, 250))
        },
        () => null,
        {
          minWait: 'foobar',
        }
      )
    } catch (err) {
      error = err
    }

    expect(error).toEqual(expect.any(Error))
    expect(error.message).toBe('option `minWait` must be a number')
  })
})
