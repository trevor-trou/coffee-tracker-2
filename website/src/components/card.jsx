import * as React from 'react';
import PropTypes from 'prop-types';

export function Card(props) {
    return (
        <div className="card text-center">
            <div className="card-body">
                <h4 className="card-title ">{props.title}</h4>
                {props.data
                    ? <h1 className="card-text font-weight-light">{props.data}</h1>
                    : (<div className="spinner-border" role="status">
                        <span className="sr-only">Loading...</span>
                    </div>)
                }
            </div>
        </div>
    );
}

Card.propTypes = {
    title: PropTypes.string.isRequired,
    data: PropTypes.string.isRequired
}