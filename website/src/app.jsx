import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { Alert } from "./components/alert";
import { Menu } from "./components/menu";
import { Card } from "./components/card";
import { StopwatchCard } from "./components/stopwatchCard";
import { checkRegistration } from "./misc/helpers";

class CoffeeTrackerPro extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            numToday: null,
            numAllTime: null,
            mostRecentBrew: null,
            alert: null,
            subscribed: null
        };
    }

    componentDidMount() {
        fetch(`${API_BASE_URL}/getdashboard`).then(response => {
            return response.json();
        }).catch(err => {
            console.error(err);
            this.setState({
                alert: "Unable to load... Please try again later."
            });
        }).then(json => {
            const { numToday, numAllTime, mostRecentBrew } = json;
            this.setState({
                numToday: numToday.toString(),
                numAllTime: numAllTime.toString(),
                mostRecentBrew
            });
        });

        checkRegistration().then(result => {
            this.setState({ subscribed: result });
        });
    }



    render() {
        return (
            <div className="container">
                <div className="row">
                    <div className="col">
                        <Menu subscribed={this.state.subscribed} />
                    </div>
                </div>
                {this.state.alert && <Alert alert={this.state.alert} />}
                <div className="row mb-3">
                    <div className="col">
                        <Card title="Brewed Today" data={this.state.numToday} />
                    </div>
                    <div className="col">
                        <Card title="Total Brewed" data={this.state.numAllTime} />
                    </div>
                </div>
                <div className="row">
                    <div className="col">
                        <StopwatchCard title="Time Since Last Brew" ISOString={this.state.mostRecentBrew} />
                    </div>
                </div>
            </div>
        )
    }
}

ReactDOM.render(<CoffeeTrackerPro />, document.getElementById('app'));