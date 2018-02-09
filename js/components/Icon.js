import React, { Component } from 'react';
import SvgUri from '../libs/svg-uri';
import svg from '../assets/svg';

export default class Icon extends Component {
    render() {
        const { name, color, size, style } = this.props;
        let svgXmlData = svg[name];

        if (!svgXmlData) {
            throw new Error(`没有" ${name} "这个icon`);
        }

        return (
            <SvgUri
                width={size}
                height={size}
                svgXmlData={svgXmlData}
                fill={color}
                style={style}
            />
        )
    }
}