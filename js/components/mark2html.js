import MarkdownIt from 'markdown-it'

const hljs = require('highlight.js')

const md = new MarkdownIt({
    html: true,
    xhtmlOut: true,
    breaks: true,
    linkify: true,
    typographer: true,
    highlight: function (str, lang) {
        if (lang && hljs.getLanguage(lang)) {
            try {
                return hljs.highlight(lang, str).value;
            } catch (__) {
            }
        }

        return ''; // use external default escaping
    }
});

export default code => md.render(code)

export const html = (code) => `
<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><title>light-git</title><link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/styles/github.min.css"><meta name="viewport"content="width=device-width,initial-scale=1,user-scalable=no"><meta http-equiv="cache-control"content="private"><style>html,body,div{padding:0;margin:0;height:100%;width:100%}</style></head><body><div>${code}</div></body></html>`