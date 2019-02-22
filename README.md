# no-flicker-loading

:no_entry_sign::zap::hourglass_flowing_sand: Show loading without the dreaded flickering (or flashing) effect.

[![CircleCI](https://circleci.com/gh/alexjab/no-flicker-loading.svg?style=svg)](https://circleci.com/gh/alexjab/no-flicker-loading)
[![codecov](https://codecov.io/gh/alexjab/no-flicker-loading/branch/master/graph/badge.svg)](https://codecov.io/gh/alexjab/no-flicker-loading)

## TLDR

Installation:

```shell
npm i no-flicker-loading
```

Usage example:

```javascript
import noFlickerLoading from 'no-flicker-loading'

const fn = async () => {
  const data = await noFlickerLoading(
    async () => {
      /* This is your "long" async call */
      const result = await fetchMyData()
      return result
    },
    () => {
      /* This function called only when loading should be displayed */
      setLoading(true)
    }
  )

  setLoading(false)

  /* Do something with the data */
}
```

## API

```
AsyncFunction: noFlickerLoading(
  main: AsyncFunction,       // <- Your main async function
  onLoading: Function,       // <- Called when you need to display loading
  {
    initDelay = 300: Number, // <- The initial delay before calling onLoading (in millisecond)
    minWait = 300: Number    // <- The minimum duration of the loading (in millisecond)
  }
) // <- Returns the result from main, or throws if main throws
```

## Rationale behind `no-flicker-loading`

When using apps, users usually don't notice loading delays below a couple hundred of milliseconds. On the other hand, they perceive the wait to be much longer if they are briefly shown a loading screen.

The idea behind this project is to call an auxiliary "loading function" only if the main "async call" takes more than 300ms (this is the default value, which you can override). If the loading function is called, then we make sure that the loading phase lasts at least 300ms (again, this is a default value).

To avoid the flickering effect, `no-flicker-loading` applies the following strategy:

- if `main()` takes less than 300ms (`initDelay`), then `onLoading` is never called,
- if `main()` takes more than 300ms (`initDelay`), then `onLoading` is called and `noFlickerLoading()` lasts at least 300ms (`minWait`),
- the result from `main()` is passed down and returned by `noFlickerLoading()`,
- any error thrown by `main()` is thrown by `noFlickerLoading()`.

## License

ISC
