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
        this.bindToServiceWorker = this.bindToServiceWorker.bind(this);

        this.subscribed = false;
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

        this.bindToServiceWorker();
    }

    bindToServiceWorker() {
        if (navigator.serviceWorker && !this.subscribed) {
            navigator.serviceWorker.addEventListener('message', (e) => {
                console.log(`Received: ${e.data}`);
                const payload = JSON.parse(e.data);

                if (payload.type === "brew") {
                    this.setState((prevState) => {
                        const numToday = (parseInt(prevState.numToday) + 1).toString();
                        const numAllTime = (parseInt(prevState.numAllTime) + 1).toString();
                        return {
                            mostRecentBrew: payload.data,
                            numToday,
                            numAllTime
                        };
                    });
                }
            });
            console.log("Bound to service worker.");
            this.subscribed = true;
        }
        else {
            console.log("No service worker present...");
        }
    }

    handleSubscriptionClick() {
        const subscribed = this.state.subscribed;
        this.setState({ subscribed: null });

        if (!subscribed) {
            subscribeUser().then(res => {
                this.setState({ subscribed: res });
                this.bindToServiceWorker();
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