 
import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { Switch, Route } from "react-router";
import AllTVShows from "./pages/home";
import WatchSchedule from "./pages/allwatchShedule";
import SingleWatchSchedule from "./pages/singleWatchSchedule";
import RegisterUser from './pages/signup'
import Login from './pages/signin'
import SingleTVShow from './pages/tvShowDetails'

const Routes = () => {

  return (
    <Router>
      <Switch>
        <Route exact path="/" component={Login} />
        <Route exact path="/signup" component={RegisterUser}/>
        <Route exact path="/home" component={AllTVShows}/>
        <Route exact path="/schedule" component={WatchSchedule} />
        <Route exact path="/schedule/:id" component={SingleWatchSchedule} />
        <Route exact path="/show/:id" component={SingleTVShow} />
      </Switch>
    </Router>
  );
};

export default Routes;