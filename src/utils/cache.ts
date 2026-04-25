import NodeCache from "node-cache";

export const cache = new NodeCache({ stdTTL: 240, checkperiod: 120 });
