import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { Menu } from "./components/menu";
import { Card } from "./components/card";
import { Stopwatch } from "./classes/stopwatch";


class CoffeeTrackerPro extends React.Component {
    constructor(props) {
        super(props)

        const cb = ({hours, minutes, seconds}) => {
            let time = hours.toString();
            time += minutes < 10 ? ":0" + minutes : ":" + minutes;
            time += seconds < 10 ? ":0" + seconds : ":" + seconds;
            console.log(time);
        }
        const s = new Stopwatch((new Date()).toISOString(), cb);
    }

    componentDidMount() {
        // console.log("About to fetch...");
        // fetch("https://coffee-api.trouchon.com/getdashboard").then(response => {
        //     return response.json();
        // }).catch(err => {
        //     console.error(err);
        // }).then(json => {
        //     console.log(JSON.stringify(json));
        // });
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
                        <Card title="Brewed Today" data={5} />
                    </div>
                    <div className="col">
                        <Card title="Total Brewed" data={5} />
                    </div>
                </div>
                <div className="row">
                    <div className="col">
                        <Card title="Time Since Last Brew" data={5} />
                    </div>
                </div>
            </div>
        )
    }
}

ReactDOM.render(<CoffeeTrackerPro />, document.getElementById('app'));