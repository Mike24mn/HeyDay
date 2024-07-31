import React, { useEffect } from "react";
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

import "./App.css";
import { Logout } from "@mui/icons-material";
import LogOutButton from "../LogOutButton/LogOutButton";

function App() {
  const dispatch = useDispatch();
  const user = useSelector((store) => store.user);

  useEffect(() => {
    dispatch({ type: "FETCH_USER" });
   
}, [dispatch]);

  return (
    <Router>
      <div>
        <Nav />
        <Switch>
          {/* Visiting localhost:5173 will redirect to localhost:5173/home */}
          <Redirect exact from="/" to="/home" />

          {/* Note to self, these are old routes */}
          <Route exact path="/about">
            <AboutPage />
          </Route>

          <Route exact path="/login">
            {user.id ? <Redirect to="/user-landing" /> : <LoginPage />}
          </Route>

          <Route exact path="/registration">
            {user.id ? <Redirect to="/user-landing" /> : <RegisterPage />}
          </Route>

          {/* new Heyday routes */}
          <Route exact path="/business-login">
            <BusinessLogin />
          </Route>

          <Route exact path="/user-landing-nonlogin">
            <UserLanding />
          </Route>

          <ProtectedRoute exact path="/business-landing">
            <BusinessLanding />
          </ProtectedRoute>

          <ProtectedRoute exact path="/edit-business-details">
            <BusinessEditPage />
          </ProtectedRoute>

          <ProtectedRoute exact path="/view-as-user">
            <BusinessViewAsUser />
          </ProtectedRoute>

          <Route exact path="/user-login">
            <LoginPage />
          </Route>

          <ProtectedRoute exact path="/user-landing">
            <UserLanding />
          </ProtectedRoute>

          <ProtectedRoute exact path="/user-details">
            <DetailsPage />
          </ProtectedRoute>

          <ProtectedRoute exact path="/favorite-locations">
            <UserFavoriteLocations />
          </ProtectedRoute>

          <ProtectedRoute exact path="/user-search-history">
            <UserSearchHistory />
          </ProtectedRoute>

          <ProtectedRoute exact path="/getting-started">
            <AboutPage />
          </ProtectedRoute>


          <ProtectedRoute exact path="/businessinfo">
            <BusinessInfo/>
          </ProtectedRoute>

          <Route exact path="/business-reg">
            <BusinessRegister/>
          </Route>

          <ProtectedRoute exact path="/user-login">
            <LogOutButton />
          </ProtectedRoute>

            <Route exact path="/random" >
            <RandomPlace/>

            </Route>

        </Switch>
        <Footer />
      </div>
    </Router>
  );
}

export default App;


