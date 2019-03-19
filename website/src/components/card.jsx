import * as React from 'react';
import PropTypes from 'prop-types';

export function Card(props) {
    return (
        <div className="card text-center">
            <div className="card-body">
            <h4 className="card-title">Number brewed today</h4>
            <p className="card-text">5</p>
            </div>
        </div>
    );
}