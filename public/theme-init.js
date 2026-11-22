(function () {
  try {
    var theme = localStorage.getItem('theme')
    if (theme !== 'light' && theme !== 'dark') {
      theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    }
    document.documentElement.classList.toggle('dark', theme === 'dark')
  } catch {
    /* storage blocked: fall back to the CSS default (light) */
  }
})()
