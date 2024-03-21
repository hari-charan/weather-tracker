import React from 'react';
import logo from './logo.svg';
import './App.css';
import { createBrowserRouter,  RouterProvider} from 'react-router-dom';
import WeatherPage from 'src/pages/weather-tacker-form-page';
import Paths from 'src/constants/paths';
import HomePage from 'src/pages/homepage';
import LineChart from './pages/history-page';


function App() {

  const routes = createBrowserRouter([
    {
      path: Paths.ROOT,
      errorElement: <HomePage/>,
      children: [
        {
          path: Paths.ROOT,
          element: <HomePage />
        },
        {
          path: Paths.CREATE_PAGE,
          element: <WeatherPage/>
        }, 
        {
          path: Paths.HISTORY_PAGE,
          element: <LineChart/>
        }
      ]
    }
  ])

  return (
    <RouterProvider router={routes}/>
  );
}

export default App;
