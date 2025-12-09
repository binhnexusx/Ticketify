import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import MainRouter from './routes/MainRouter';
import './index.css';
import { store } from '@/redux/store';

const App: React.FC = () => (
  <Provider store={store}>
    <BrowserRouter>
      <MainRouter />
    </BrowserRouter>
  </Provider>
);

export default App;
