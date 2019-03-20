import * as React from 'react';
import PropTypes from 'prop-types';
import { Stopwatch } from "../misc/stopwatch";

export class StopwatchCard extends React.Component {
    constructor(props) {
        super(props);
        this.stopwatchCallback = this.stopwatchCallback.bind(this);

        this.stopwatch = new Stopwatch(this.stopwatchCallback);
        let time = null;
        if (props.ISOString) {
            time = this.formatTime(stopwatch.restart(ISOString));
        }
        

        this.state = {
            time: time,
            ISOString: props.ISOString
        }
    }

    formatTime({ hours, minutes, seconds }) {
        let time = hours.toString();
        time += minutes < 10 ? ":0" + minutes : ":" + minutes;
        time += seconds < 10 ? ":0" + seconds : ":" + seconds;

        return time;
    }

    stopwatchCallback(timeObj) {
        const time = this.formatTime(timeObj);
        this.setState({ time });
    }

    componentDidUpdate(prevProps) {
        if (prevProps.ISOString !== this.props.ISOString) {
            const time = this.formatTime(this.stopwatch.restart(this.props.ISOString));
            this.setState({ ISOString: this.props.ISOString, time: time });
        }
    }

    render() {
        return (
            <div className="card text-center">
                <div className="card-body">
                    <h4 className="card-title ">{this.props.title}</h4>
                    {this.state.time
                        ? <h1 className="card-text font-weight-light">{this.state.time}</h1>
                        : (<div className="spinner-border" role="status">
                            <span className="sr-only">Loading...</span>
                        </div>)
                    }
                </div>
            </div>
        );
    }
}

StopwatchCard.propTypes = {
    title: PropTypes.string.isRequired,
    ISOString: PropTypes.string
}