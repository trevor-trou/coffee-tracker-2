import * as React from 'react';
import * as ReactDOM from 'react-dom';

class CoffeeTrackerPro extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <h1>Hello, world!</h1>
        );
    }
}

ReactDOM.render(<CoffeeTrackerPro />, document.getElementById('app'));