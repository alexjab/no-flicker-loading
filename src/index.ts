interface LoadingOptions {
  initDelay?: number
  minWait?: number
}

export async function noFlickerLoading(
  main: () => void,
  onLoading: () => void,
  { initDelay = 300, minWait = 300 }: LoadingOptions = {
    initDelay: 300,
    minWait: 300,
  }
) {
  assert(main, 'first parameter `main` is required')
  assert(
    typeof main === 'function',
    'first parameter `main` must be a function'
  )
  assert(onLoading, 'second parameter `onLoading` is required')
  assert(
    typeof onLoading === 'function',
    'second parameter `onLoading` must be a function'
  )
  assert(typeof initDelay === 'number', 'option `initDelay` must be a number')
  assert(typeof minWait === 'number', 'option `minWait` must be a number')

  let loadingStart = null
  const initTimeout = setTimeout(() => {
    onLoading()
    loadingStart = Date.now()
  }, initDelay)

  let error
  let result
  try {
    result = await main()
  } catch (err) {
    error = err
  }

  clearTimeout(initTimeout)

  if (loadingStart && Date.now() - loadingStart < minWait) {
    await new Promise(resolve => setTimeout(resolve, minWait))
  }

  if (error) {
    throw error
  }

  return result
}

export default noFlickerLoading

function assert(value: any, message: string) {
  if (!value) {
    throw new Error(message)
  }
}
