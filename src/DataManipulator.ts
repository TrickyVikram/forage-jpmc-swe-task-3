import { ServerRespond } from './DataStreamer';

export interface Row {
  stock: string,
  top_ask_price: number,
  top_bid_price: number,
  timestamp: Date,
  ratio: number,
  upper_bound: number,
  lower_bound: number,
}

export class DataManipulator {
  static generateRow(serverResponds: ServerRespond[]): Record<string, (string | number | boolean | Date)[]> {
    // Initialize an empty dictionary to store column data
    const columns: Record<string, (string | number | boolean | Date)[]> = {
      stock: [],
      top_ask_price: [],
      top_bid_price: [],
      timestamp: [],
      ratio: [],
      upper_bound: [],
      lower_bound: [],
    };

    serverResponds.forEach((el: any) => {
      const topAskPrice = el.top_ask && el.top_ask.price || 0;
      const topBidPrice = el.top_bid && el.top_bid.price || 0;
      const ratio = topAskPrice / (topBidPrice || 1); // Avoid division by zero

      columns.stock.push(el.stock);
      columns.top_ask_price.push(topAskPrice);
      columns.top_bid_price.push(topBidPrice);
      columns.timestamp.push(el.timestamp);
      columns.ratio.push(ratio);
      columns.upper_bound.push(100); // Example upper bound
      columns.lower_bound.push(10);  // Example lower bound
    });

    return columns;
  }
}
