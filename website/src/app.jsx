import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { Menu } from "./components/menu";
import { Card } from "./components/card";


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
                <div className="row">
                    <div className="col">
                        <Menu subscribed={true} />
                    </div>
                </div>
                <div className="row mb-4">
                    <div className="col">
                        <Card />
                    </div>
                    <div className="col">
                        <Card />
                    </div>
                </div>
                <div className="row">
                    <div className="col">
                        <Card />
                    </div>
                </div>
            </div>
        )
    }
}

ReactDOM.render(<CoffeeTrackerPro />, document.getElementById('app'));