export { default as Button } from './Button'
export { default as md, html } from './mark2html'
export { default as CAlert } from './CAlert'
export { default as CLoading } from './CLoading'
export { default as Loading } from './CLoading/CLoading'
export { default as CList } from './CList'
export { CButton } from './CButton'
export { default as Icon } from './Icon'

import Toast from './CToast'

global.toast = Toast.toast;
