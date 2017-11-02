const marked = require('marked')

marked.setOptions({
    gfm: true,
    tables: true,
    breaks: true,
    pedantic: true,
    sanitize: true,
    smartLists: true,
    smartypants: true
});

export default code => marked(code)

export const html = (code) => `
<!DOCTYPE html><html lang="en"><style>html,body{padding:0;margin:0;height:100%;width:100%}</style><link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/styles/monokai-sublime.min.css"><script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/highlight.min.js"></script><script>hljs.initHighlightingOnLoad();</script><head><meta charset="UTF-8"><title>light-git</title><meta http-equiv="cache-control" content="private"><meta name="viewport" content="width=device-width,initial-scale=1,user-scalable=no"></head><body>${code}</body></html>`
