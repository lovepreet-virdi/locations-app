import React, { Component } from 'react'
import noLoc from './assets/nolocation.png';
export default class NoLocation extends Component {
    render() {
        return (
            <div className="text-center">
                <img src={noLoc} alt="no-location" />
            </div>
        )
    }
}
