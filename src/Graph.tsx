import React, { Component } from 'react';
import { Table } from '@finos/perspective';
import { ServerRespond } from './DataStreamer';
import { DataManipulator } from './DataManipulator';
import './Graph.css';

interface IProps {
  data: ServerRespond[],
}

interface PerspectiveViewerElement extends HTMLElement {
  load: (table: Table) => void,
}

class Graph extends Component<IProps, {}> {
  table: Table | undefined;

  render() {
    return React.createElement('perspective-viewer');
  }

  componentDidMount() {
    // Get element from the DOM.
    const elem = document.getElementsByTagName('perspective-viewer')[0] as unknown as PerspectiveViewerElement;

    const schema = {
      stock: 'string',
      top_ask_price: 'float',
      top_bid_price: 'float',
      timestamp: 'date',
      ratio: 'float',
      upper_bound: 'float',
      lower_bound: 'float',
    };

    if (window.perspective && window.perspective.worker()) {
      this.table = window.perspective.worker().table(schema);
    }
    if (this.table) {
      // Load the `table` in the `<perspective-viewer>` DOM reference.
      elem.load(this.table);
      elem.setAttribute('view', 'y_line');
      elem.setAttribute('column-pivots', '["stock"]');
      elem.setAttribute('row-pivots', '["timestamp"]');
      elem.setAttribute('columns', '["ratio", "upper_bound", "lower_bound"]');
      elem.setAttribute('aggregates', JSON.stringify({
        stock: 'distinctcount',
        top_ask_price: 'avg',
        top_bid_price: 'avg',
        timestamp: 'distinct count',
        ratio: 'avg',
        upper_bound: 'max',
        lower_bound: 'min',
      }));
    }
  }

  componentDidUpdate() {
    if (this.table) {
      // Update the table with the new data in the correct format
      this.table.update(
        DataManipulator.generateRow(this.props.data) as any
      );
    }
  }
}

export default Graph;