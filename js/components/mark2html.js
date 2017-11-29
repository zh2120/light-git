import Marked from 'marked'
// Marked.setOptions({
//     renderer: new Marked.Renderer(),
//     gfm: true,
//     tables: true,
//     breaks: true,
//     pedantic: false,
//     sanitize: false,
//     smartLists: true,
//     smartypants: false
// });

const hljs = require('highlight.js')

// const md = new MarkdownIt({
//     html: true,
//     xhtmlOut: true,
//     breaks: true,
//     linkify: true,
//     typographer: true,
//     highlight: function (str, lang) {
//         if (lang && hljs.getLanguage(lang)) {
//             try {
//                 return hljs.highlight(lang, str).value;
//             } catch (__) {
//             }
//         }
//
//         return ''; // use external default escaping
//     }
// });

export default code => Marked(code)

export const html = (code) => `
<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><title>light-git</title><link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/styles/github.min.css"><meta name="viewport" content="width=device-width,initial-scale=1,user-scalable=no"><meta http-equiv="cache-control" content="private"><style>html,body{padding:0;margin:0;height:100%;width:100%}img {width: 100%;height: auto}</style></head><body><article>${code}</article></body></html>`
