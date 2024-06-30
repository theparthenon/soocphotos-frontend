import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { HistoryRouter as Router } from "redux-first-history/rr6";

import App from "./App";
import { soocHistory, store } from "./store/store";

const container = document.getElementById("root");
const root = createRoot(container!); // createRoot(container!) if you use TypeScript

root.render(
    <StrictMode>
        <Provider store={store}>
            <Router history={soocHistory}>
                <App/>
            </Router>
        </Provider>
    </StrictMode>
);