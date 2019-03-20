import * as React from 'react';
import PropTypes from 'prop-types';

function getButton(subscribed) {
    if (subscribed === null) {
        return (<button className="btn btn-outline-primary ml-2" disabled>Loading...</button>);
    }
    else if (subscribed) {
        return (<button className="btn btn-success">Subscribed <i className="material-icons" style={{ fontSize: "inherit" }}>done</i></button>);
    }
    else {
        return (<p className="text-muted font-italic" style={{ margin: 0, padding: 0 }}>
            Want to be notified when the coffees fresh? <button className="btn btn-outline-primary ml-2">Subscribe</button>
        </p>);
    }
}
export function Menu(props) {
    return (
        <nav className="navbar navbar-light bg-light mb-3">
            <div className="navbar-brand">
                <h4 style={{ margin: 0, padding: 0 }} >
                    <img src="images/favicon-32x32.png" width="30" height="30" className="d-inline-block align-top mr-2" alt="" />
                    Coffee Tracker Pro
                </h4>
            </div>
            {getButton(props.subscribed)}
        </nav>
    );
}

Menu.propTypes = {
    subscribed: PropTypes.bool
};