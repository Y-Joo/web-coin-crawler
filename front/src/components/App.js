import React, { Suspense } from 'react';
import { Route, Switch } from "react-router-dom";
import { Layout } from 'antd';
import LandingPage from "./views/LandingPage/LandingPage";

const { Header, Footer, Sider, Content } = Layout;

function App() {
  return (
    <Suspense fallback={(<div>Loading...</div>)}>
        <Switch>
          <Route exact path="/" component={LandingPage} />
        </Switch>
        <Footer style={{backgroundColor: 'white'}}></Footer>
    </Suspense>
  );
}

export default App;
