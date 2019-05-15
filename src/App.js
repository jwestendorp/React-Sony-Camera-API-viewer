import React, { Component } from "react";

import "./App.css";
import "./bootstrap-3.3.7-dist/css/bootstrap.min.css";

import { Liveview } from "./Liveview";

export const BASE_URL = process.env.REACT_APP_API_BASE;

class App extends Component {
  state = {
    data: null,
    request: {
      method: "getAvailableApiList",
      params: [],
      id: 1,
      version: "1.0"
    },

    response: null,
    AvailableApiList: ["connect to camera first"],
    liveViewSrc: ""
  };

  RPC = async request => {
    const response = await fetch(BASE_URL + "/RPC", {
      method: "POST",
      body: JSON.stringify(request),
      headers: {
        "Content-Type": "application/json"
      }
    });
    const body = await response.json();
    return body;
  };

  componentDidMount() {
    // Call our fetch function below once the component mounts
    this.callBackendAPI()
      .then(res => this.setState({ data: res.express }))
      .catch(err => console.log(err));

    this.RPC(this.state.request)
      .then(res => this.setState({ AvailableApiList: res.result[0] }))
      .catch(err => console.log(err));
  }
  // Fetches our GET route from the Express server. (Note the route we are fetching matches the GET route from server.js
  callBackendAPI = async () => {
    const response = await fetch(BASE_URL + "/express_backend");
    const body = await response.json();

    if (response.status !== 200) {
      throw Error(body.message);
    }
    return body;
  };
  handleChange = event => {
    console.log(event.target.value);
    let newRequest = this.state.request;
    newRequest[event.target.name] = event.target.value;
    this.setState(state => ({
      request: newRequest
    }));
  };
  refreshApiList() {
    console.log("refreshing API list");

    let request = {
      ...this.state.request,
      method: "getAvailableApiList",
      params: []
    };
    this.RPC(request);
  }
  render() {
    return (
      <div
        className="App"
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr"
        }}
      >
        <div
          id="request"
          style={{
            display: "grid",
            gridTemplateRows: "75px 55vh 5vh auto",
            gridColumnStart: "1",
            padding: "0px 20px 0px 20px ",
            overflow: "hidden",
            background: "rgba(100,100,100,0.6)",
            height: "100vh"
          }}
        >
          <div>
            <h3> RPC request: </h3>
            <hr />
          </div>
          <div
            style={{
              gridRowStart: "2",
              overflow: "auto"
            }}
          >
            <b>method:</b>
            <br />
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "5fr 1fr",
                textAlign: "center"
              }}
            >
              <select
                name="method"
                value={this.state.request.method}
                onChange={this.handleChange.bind(this)}
                class="form-control"
                style={{ gridColumnStart: 1 }}
              >
                {this.state.AvailableApiList.map(api => {
                  return <option value={api}>{api}</option>;
                })}
              </select>

              <button
                onClick={() => this.refreshApiList()}
                style={{ gridColumnStart: 2 }}
                className="btn btn-default"
              >
                <span class="glyphicon glyphicon-refresh" aria-hidden="true" />
              </button>
            </div>
            <br />
            <b>params:</b>{" "}
            <textarea
              name="params"
              placeholder="optional"
              value={this.state.request.params}
              onChange={this.handleChange.bind(this)}
              rows="2"
              style={{ width: "100%" }}
              class="form-control"
            />
            <br />
            <br />
            preview:
            <textarea
              readOnly="true"
              placeholder="Send a request..."
              value={JSON.stringify(this.state.request, null, " ")}
              rows="6"
              style={{ width: "100%" }}
              class="form-control"
            />
          </div>
          <div
            style={{
              gridColumnStart: "1",
              gridRowStart: "3"
            }}
          >
            <button
              class="btn btn-primary"
              onClick={() => this.RPC(this.state.request)}
            >
              Send Request
            </button>
            <hr />
          </div>
          <div
            id="response"
            style={{
              gridRowStart: " 4",
              paddingTop: "10px",
              overflow: "auto"
            }}
          >
            <h4>repsonse: </h4>
            <textarea
              readOnly="true"
              placeholder="Send a request..."
              value={JSON.stringify(this.state.response, null, " ")}
              rows="4"
              style={{ width: "100%" }}
              class="form-control"
            />
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateRows: "75px 55vh 5vh auto",
            gridColumnStart: "2",
            padding: "0px 20px 0px 20px ",
            overflow: "hidden"
          }}
        >
          <div>
            <h3> Liveview: </h3>
            <hr />
          </div>

          <div style={{ gridRowStart: "2" }}>
            <Liveview
              ref={liveview => {
                this.liveview = liveview;
              }}
            />
          </div>

          <div
            style={{
              gridRowStart: "3"
            }}
          >
            <button
              onClick={() => this.liveview.getLiveviewData()}
              class="btn btn-primary"
            >
              Fetch Liveview
            </button>
            <hr />
          </div>
        </div>

        <div
          className="App-intro"
          style={{
            position: "fixed",
            bottom: 0,
            padding: "5px",
            background: "white"
          }}
        >
          proxy status:
          <span
            className={
              this.state.data != null
                ? "label label-success"
                : "label label-danger"
            }
          >
            {this.state.data != null ? this.state.data : "Not connected"}
          </span>
        </div>
      </div>
    );
  }
}

export default App;
