import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Alert } from "./components/alert";
import { Menu } from "./components/menu";
import { Card } from "./components/card";
import { StopwatchCard } from "./components/stopwatchCard";
import { checkRegistration, subscribeUser, unsubscribeUser } from "./misc/helpers";


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

        this.handleSubscriptionClick = this.handleSubscriptionClick.bind(this);
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

    handleSubscriptionClick() {
        const subscribed = this.state.subscribed;
        this.setState({ subscribed: null });

        if (!subscribed) {
            subscribeUser().then(res => {
                this.setState({ subscribed: res });
            }).catch(err => {
                this.setState({ subscribed: false });
                this.setState({
                    alert: `Error subscribing: ${err}`
                });
            });
        }
        else {
            unsubscribeUser().then(result => {
                this.setState({ subscribed: false });
            }).catch(err => {
                this.setState({ subscribed: true });
                this.setState({
                    alert: `Error unsubscribing: ${err}`
                });
            });
        }
    }


    render() {
        return (
            <div className="container">
                <div className="row">
                    <div className="col">
                        <Menu subscribed={this.state.subscribed} onClick={this.handleSubscriptionClick} />
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