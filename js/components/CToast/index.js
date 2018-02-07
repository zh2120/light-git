import React from 'react';
import AppWrapper from 'react-native-root-wrapper'
import CToast from './CToast'

export default class {
    constructor(text) {
        this.instance = null;
        if (!this.instance) {
            (new AppWrapper(<CToast
                ref={re => (this.instance = re)}/>)).subScribe(() => this.instance.open(text))
        } else {
            this.instance.open(text)
        }
    }
}