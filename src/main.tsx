import * as Sentry from "@sentry/react";
import ReactDOM, { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { HistoryRouter as Router } from "redux-first-history/rr6";
import { StrictMode } from "react";

import App from "./App";
import { soocHistory, store } from "./store/store";

Sentry.init({
    dsn: "https://189270832b9600b03f63e799f8d83f85@o4507504124624896.ingest.us.sentry.io/4507504127901696",
    integrations: [
      Sentry.browserTracingIntegration(),
      Sentry.replayIntegration(),
    ],
    // Performance Monitoring
    tracesSampleRate: 1.0, //  Capture 100% of the transactions
    // Set 'tracePropagationTargets' to control for which URLs distributed tracing should be enabled
    tracePropagationTargets: ["localhost", /^https:\/\/yourserver\.io\/api/],
    // Session Replay
    replaysSessionSampleRate: 1.0, // This sets the sample rate at 10%. You may want to change it to 100% while in development and then sample at a lower rate in production.
    replaysOnErrorSampleRate: 1.0, // If you're not already sampling the entire session, change the sample rate to 100% when sampling sessions where errors occur.
  });

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
)