import React, { Component } from 'react';
import './App.css';
import Layout from './components/Layout';
import { Router, Switch, Route } from 'react-router-dom';
import history from "./components/helpers/history";
import Playlist from './pages/Playlist';
import Dashboard from './pages/Dashboard';
import './components/helpers/Protototypes'

class App extends Component {

  render() {

    return (
      <div className="App">
        <Router history={history}>
          <Layout>
            <Switch>
              <Route exact={true} path="/" component={Dashboard} />
              <Route exact={true} path="/playlists/:id" component={Playlist} />
            </Switch>
          </Layout>
        </Router>
      </div>
    );
  }
}

export default App;
