const marked = require('marked')

marked.setOptions({
    highlight: function (code) {
        return require('highlight.js').highlightAuto(code).value;
    }
});

export default code => marked(code)

export const html = (code) =>  `
<!DOCTYPE html><html lang="en"><style>html,body{padding:0;margin:0;height:100%;width:100%}</style><head><meta charset="UTF-8"><title>README.md</title><meta name="viewport" content="width=device-width,initial-scale=1,user-scalable=no"></head><body>${code}</body></html>`