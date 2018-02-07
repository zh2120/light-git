import React from 'react';
import AppWrapper from 'react-native-root-wrapper'
import CAlert from './CAlert'

export default {
    instance: null,
    open(title, content, actions) {
        if (!this.instance) {
            (new AppWrapper(
                <CAlert ref={re => (this.instance = re)}/>)).subScribe(() => this.instance.open(title, content, actions))
        } else {
            this.instance.open(title, content, actions)
        }
    },
    close() {
        if (this.instance) {
            this.instance.close()
        }
    }
}
