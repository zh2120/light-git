import React, {PureComponent} from 'react';
import AppWrapper from 'react-native-root-wrapper'
import CLoading from './CLoading'

export default {
    instance: null,
    open(text) {
        if (!this.instance) {
            (new AppWrapper(<CLoading
                ref={re => (this.instance = re)} only={true}/>)).subScribe(() => this.instance.open(text))
        } else {
            this.instance.open(text)
        }
    },
    close() {
        if (this.instance){
            this.instance.close();
        }
    }
}
