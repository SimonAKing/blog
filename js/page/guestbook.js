const isSmallScreen = window.innerWidth < 500
function getPoem(poemEle, infoEle) {
  const poem = document.querySelector(poemEle)
  const info = document.querySelector(infoEle)
  const xhr = new XMLHttpRequest()
  xhr.open('get', 'https://v2.jinrishici.com/one.json')
  xhr.withCredentials = true
  xhr.timeout = 3000
  function errorHandle() {
    poem.innerHTML = `晚来天欲雪，${isSmallScreen ? '<br/>' : ''}能饮一杯无？`
    info.innerHTML = '【唐代】白居易《问刘十九》'
  }
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4) {
      if ((xhr.status >= 200 && xhr.status < 300) || xhr.status === 304) {
        const data = JSON.parse(xhr.responseText)
        if (isSmallScreen) {
          poem.innerHTML = data.data.content.replace(/，/g, '，<br/>')
          info.innerHTML = `《${data.data.origin.title}》<br/>【${data.data.origin.dynasty}】${data.data.origin.author}`
        } else {
          poem.innerHTML = data.data.content
          info.innerHTML = `《${data.data.origin.title}》【${data.data.origin.dynasty}】${data.data.origin.author}`
        }
      } else {
        errorHandle()
      }
    }
  }
  xhr.ontimeout = errorHandle
  xhr.onerror = errorHandle
  xhr.send()
}
getPoem('#poem', '#info')
