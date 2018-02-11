import React, { Component } from 'react';
import PropTypes from 'prop-types';
import SvgUri from '../libs/svg-uri';
import svg from '../assets/svg';

export default class Icon extends Component {
    static propTypes = {
        name: PropTypes.string,
        color: PropTypes.string,
        size: PropTypes.number,
        style: PropTypes.oneOfType([PropTypes.object, PropTypes.number, PropTypes.array])
    };

    render() {
        const { name, color, size, style } = this.props;
        const svgXmlData = svg[name];

        if (!svgXmlData) {
            throw new Error(`没有" ${name} "这个icon`);
        }

        return (
            <SvgUri
                width={size}
                height={size || 16}
                svgXmlData={svgXmlData}
                fill={color}
                style={style}
            />
        )
    }
}