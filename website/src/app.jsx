import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { Menu } from "./components/menu";

class CoffeeTrackerPro extends React.Component {
    constructor(props) {
        super(props)
    }

    componentDidMount() {
        console.log("About to fetch...");
        fetch("https://coffee-api.trouchon.com/getdashboard").then(response => {
            return response.json();
        }).catch(err => {
            console.error(err);
        }).then(json => {
            console.log(JSON.stringify(json));
        });
    }

    render() {
        return (
            <div className="container">
                <Menu subscribed={true} />
                <div className="card card-body bg-light">Basic Well</div>
            </div>
        );
    }
}

ReactDOM.render(<CoffeeTrackerPro />, document.getElementById('app'));