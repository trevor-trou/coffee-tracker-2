import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { Menu } from "./components/menu";
import { Card } from "./components/card";

import './style/base.css';

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
        //     return (
        //         <div className="container">
        //             <Menu subscribed={true} />
        //             <div className="vertical-center">

        //             </div>


        //             {/* <div className="card card-body bg-light">Basic Well</div> */}
        //         </div>
        //     );
        // }

        return (
            <div className="flex">
                {/* <div className="flex-header">
                    <div className="container">
                        <Menu subscribed={true} />
                    </div>
                </div> */}
                <div className="flex-remain align-items-center d-flex">

                    <div className="container">
                        <div className="card" style={{ minWidth: "100%" }}>
                            <div className="card-body">
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
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

ReactDOM.render(<CoffeeTrackerPro />, document.getElementById('app'));