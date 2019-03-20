import * as React from 'react';
import PropTypes from 'prop-types';

export function Alert(props) {
    return (
        <div className="alert alert-danger" role="alert">
            {props.alert}
        </div>
    );
}

Alert.propTypes = {
    alert: PropTypes.string.isRequired
}