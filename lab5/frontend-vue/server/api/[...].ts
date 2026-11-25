
export default defineEventHandler((event) => {
  const url = getRequestURL(event)

  return proxyRequest(
    event,
    //`http://localhost:8080${url.pathname}${url.search}`
    `http://backend:8080${url.pathname}${url.search}`
  )
})
