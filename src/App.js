import './App.css';
import Header from './components/Header';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import routes from './utils/routes';
import {useSelector} from 'react-redux'
import { useEffect, useState } from 'react';
import ReactNotification  from 'react-notifications-component'
import 'react-notifications-component/dist/theme.css'
import Footer from './components/Footer';
import CacheBuster from './CacheBuster';

function App() {

  const accountDetails = useSelector(state => state.accountDetails);
  const [acDetails, setacDetails] = useState("");
  
  useEffect(() => {
    setacDetails(accountDetails);
  }, [accountDetails]);

  const mainRoute = ["/","/about","/contact","/allteachers","/allsubjects","/stlogin","/stsignup"];
  let location = window.location.pathname;
  
  const headerRoute = () =>{
    
    if(mainRoute.includes(location)){
      return <Header acDetails={acDetails} />
    }
    else if(acDetails && acDetails.key && acDetails.is_teacher){
      return null
    }
    else if(acDetails && acDetails.key && !acDetails.is_teacher){
      return null
    }
  }

  const footerRout = ()=>{
    if(mainRoute.includes(location)){
      return <Footer/>
    }
    else if(acDetails && acDetails.key && acDetails.is_teacher){
      return null
    }
    else if(acDetails && acDetails.key && !acDetails.is_teacher){
      return null
    }
  }

  /*return (
    <CacheBuster>
      {({ loading, isLatestVersion, refreshCacheAndReload }) => {
        if (loading) return null;
        if (!loading && !isLatestVersion) {
          // You can decide how and when you want to force reload
          refreshCacheAndReload();
        }*/

        return (
          <div className="App">
            <ReactNotification isMobile='true'/>
              <Router>
                  {
                    headerRoute()
                  } 
                  <Switch>
                    {
                      routes.map((route,index) => <Route path={route.path} key={index} exact={route.exact} component={route.components} />)
                    }
                  </Switch>
                  {
                    footerRout()
                  }
              </Router>
          </div>
        );
    /*}}
    </CacheBuster>
  );*/
}

export default App;
