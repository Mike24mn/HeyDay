import React, { useEffect, useState } from "react";
import {
  HashRouter as Router,
  Redirect,
  Route,
  Switch,
} from "react-router-dom";

import RandomPlace from "../RandomPlace/RandomPlace";
import { useDispatch, useSelector } from "react-redux";

import LoginPage from "../LoginPage/LoginPage";
import RegisterPage from "../RegisterPage/RegisterPage";
import Nav from "../Nav/Nav";
import Footer from "../Footer/Footer";

import ProtectedRoute from "../ProtectedRoute/ProtectedRoute";
import HappyMapping from "../HappyMapping/HappyMapping";

import AboutPage from "../AboutPage/AboutPage";
import BusinessRegister from "../BusinessRegister/BusinessRegister";

import BusinessViewAsUser from "../BusinessViewAsUser/BusinessViewAsUser";
import UserLanding from "../UserLanding/UserLanding";
import DetailsPage from "../DetailsPage/DetailsPage";
import UserFavoriteLocations from "../UserFavoriteLocations/UserFavoriteLocations";
import BusinessLogin from "../BusinessLogin/BusinessLogin";
import BusinessLanding from "../BusinessLanding/BusinessLanding";
import BusinessEditPage from "../BusinessEditPage/BusinessEditPage";
import BusinessInfo from "../BusinessInfo/BusinessInfo";

import UserSearchHistory from "../UserSearchHistory/UserSearchHistory";
import history from '../../history';
import "./App.css";
import { Logout } from "@mui/icons-material";
import LogOutButton from "../LogOutButton/LogOutButton";

function App() {
  const dispatch = useDispatch();
  const user = useSelector((store) => store.user);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    dispatch({ type: "FETCH_USER" });
  }, [dispatch]);

  useEffect(() => {
    if (user !== null) {
      setLoading(false);
    }
  }, [user]);

  return (
    <Router history={history}>
        <div className="app-container">
        <Nav />
        <Switch>
          {/* Visiting localhost:5173 will redirect to localhost:5173/home */}
          <Redirect exact from="/" to="/home" />

          {/* Note to self, these are old routes */}
          <Route exact path="/about" component={AboutPage} />

          <Route exact path="/login">
            {user?.id ? (
              user.access_level === 2 ? (
                <Redirect to="/business-landing" />
              ) : (
                <Redirect to="/user-landing" />
              )
            ) : (
              <LoginPage />
            )}
          </Route>

          <Route exact path="/registration">
            {user?.id ? <Redirect to="/user-landing" /> : <RegisterPage />}
          </Route>

          {/* new Heyday routes */}
          <Route exact path="/business-login" component={BusinessLogin} />

          <Route exact path="/user-landing-nonlogin" component={UserLanding} />

          <ProtectedRoute exact path="/business-landing" component={BusinessLanding} />

          <ProtectedRoute exact path="/edit-business-details" component={BusinessEditPage} />

          <ProtectedRoute exact path="/view-as-user" component={BusinessViewAsUser} />

          <Route exact path="/user-login" component={LoginPage} />

          <ProtectedRoute exact path="/user-landing" component={UserLanding} />

          <ProtectedRoute exact path="/user-details/:id" component={DetailsPage} />

          <ProtectedRoute exact path="/favorite-locations" component={UserFavoriteLocations} />

          <ProtectedRoute exact path="/user-search-history" component={UserSearchHistory} />

          <ProtectedRoute exact path="/getting-started" component={AboutPage} />

          <ProtectedRoute exact path="/businessinfo" component={BusinessInfo} />

          <Route exact path="/business-reg" component={BusinessRegister} />

              <ProtectedRoute exact path="/user-login">
              {user?.id ? (
                user.access_level === 2 ? (
                  <Redirect to="/business-login" />
                ) : (
                  <Redirect to="/user-login" />
                )
              ) : (
                <LoginPage />
              )}
            </ProtectedRoute>

          <Route exact path="/random" component={RandomPlace} />

          <Route exact path="/happy" component={HappyMapping} />
        </Switch>
        <Footer />
      </div>
    </Router>
  );
}

export default App;