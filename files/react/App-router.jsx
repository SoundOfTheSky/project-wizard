import React from 'react';
import { Route, Switch } from 'react-router-dom';
import './App.scss';
import Todo from '@/components/Todo';
import About from '@/components/About';

function App() {
  return (
    <div className="App">
      <Switch>
        <Route exact path="/">
          <Todo />
        </Route>
        <Route path="/About">
          <About />
        </Route>
      </Switch>
    </div>
  );
}

export default App;
