import React from 'react';
import { dlOptions } from '../utils';
import createPlotlyComponent from 'react-plotly.js/factory';
const Plotly = window.Plotly;
const Plot = createPlotlyComponent(Plotly);

export class NDefectsPlot extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    let buttons = [];
    let len = 0;
    for (const key in this.props.fields) {
      const field = this.props.fields[key];
      if (field.type != "box") continue;
      len++;
    }
    let i = 0;
    for (const key in this.props.fields) {
        const field = this.props.fields[key];
        if (field.type != "box") continue;
        let ar = new Array(len).fill(false);
        ar[i++] = true;
        buttons.push({
            method: "restyle",
            args: ['visible', ar],
            label: key
        });
    }
    return (
      <Plot
        data= {this.props.data}
        layout = {{
          //title: this.props.title,
          hovermode: "closest",
          yaxis: {
              //showgrid: true
              zeroline: false
          },
          boxmode: "group",
          margin: { l: 30, r: 10, b: 120, t: 30, pad: 1 },
         updatemenus: [{
        y: 1.05,
        x: 0.11,
        yanchor: 'top',
        buttons: buttons
    }]

       }}
        style={{height: "460px", width: "100%"}}
        useResizeHandler
        config={dlOptions('csaransh-stats-boxed')}
      />
    );
  }
}
/*

Plotly.Plot.resize()
*/