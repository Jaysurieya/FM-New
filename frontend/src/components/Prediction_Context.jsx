import { createContext } from 'react';

// This context will act as a bridge to share data across our app.
// We initialize it with null.
const PredictionContext = createContext(null);

export default PredictionContext;

