export const loadScript = url => {
  return new Promise(resolve => {
    const script = document.createElement('script')
    script.onload = () => {
      resolve(url)
    }
    script.src = url
    document.body.appendChild(script)
  })
}
