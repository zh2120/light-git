import React from 'react';
import {CAlert} from '../'
import CLoading from './CLoading'

export default {
    open: (title, actions) => CAlert.open(title, <CLoading/>, actions),
    close: CAlert.close
}
