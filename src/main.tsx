import ReactDOM, { createRoot } from 'react-dom/client';
import App from './App';
import { soocHistory, store } from './store/store';
import { Provider } from 'react-redux';
import { HistoryRouter as Router } from "redux-first-history/rr6";
import { StrictMode } from 'react';

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