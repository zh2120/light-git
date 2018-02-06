import React from 'react';
import AppWrapper from 'react-native-root-wrapper'
import CToast from './CToast'

export default {
    instance: null,
    open(text) {
        if (!this.instance) {
            (new AppWrapper(<CToast
                ref={re => (this.instance = re)}/>)).subScribe(() => this.instance.open(text))
        } else {
            this.instance.open(text)
        }
    }
}