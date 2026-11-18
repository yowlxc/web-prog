
export default defineEventHandler((event) => {
  const url = getRequestURL(event)

  return proxyRequest(
    event,
    `http://backend:8080${url.pathname}${url.search}`
  )
})
