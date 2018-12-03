import React, { Component } from "react";
import "./bootstrap-3.3.7-dist/css/bootstrap.min.css";
const request = require("request");

export class Liveview extends Component {
    state = { liveViewSrc: "", renderFinished: true };

    shouldComponentUpdate() {
        if (this.state.renderFinished) {
            this.setState({ renderFinished: false });
            return true;
        }
        return false;
    }

    componentDidUpdate() {
        if (!this.state.renderFinished) {
            this.setState({ renderFinished: true });
        }
    }

    getLiveviewData = async () => {
        console.log("fetch liveview");
        request("http://localhost:3000/liveview")
            .on("error", function(err) {
                console.log(err);
            })
            .on("data", stream => {
                // console.log(stream);
                let blob = new Blob([stream], {
                    type: "image/jpeg"
                });

                var urlCreator = window.URL || window.webkitURL;
                var imageUrl = urlCreator.createObjectURL(blob);
                this.setState({
                    liveViewSrc: imageUrl
                });
            });
    };

    render() {
        return (
            <div
                className="img-thumbnail"
                style={{
                    width: "100%",
                    height: "90%"
                }}
            >
                <img src={this.state.liveViewSrc} />
            </div>
        );
    }
}
