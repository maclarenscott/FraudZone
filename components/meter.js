import React, { Component } from "react";
import { render } from "react-dom";
// import "./style.css";

import {GaugeChart} from "react-gauge-chart";

export class Meter extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "React",
        // risk: this.props.risk
    };
  }

  render() {
    return (
      <div>
        <GaugeChart
          id="gauge-chart3"
          nrOfLevels={3}
          colors={["green", "orange", "red"]}
          arcWidth={0.3}
          percent={parseFloat(this.props.risk)}
          textColor={'black'}
          // hideText={true} // If you want to hide the text
        />
      </div>
    );
  }
}

