import '@babel/polyfill'
import noFlickerLoading from 'no-flicker-loading'

// Your loading function
const setLoading = isLoading => {
  console.log(isLoading ? 'Loading...' : 'Done.')
}

// Your async call
const fetchMyData = async (timeout = 1000) => {
  await new Promise(resolve => setTimeout(resolve, timeout))
  return 'Hello world'
}

const main = async () => {
  const data = await noFlickerLoading(
    async () => {
      /* This is your "long" async call */
      const result = await fetchMyData(1000) // <- Change this to 100
      return result
    },
    () => {
      /* This function called only when loading should be displayed */
      setLoading(true)
    }
  )

  setLoading(false)

  console.log(data)
}

main().catch(console.error)
