import {Route, Routes} from 'react-router-dom'
import './App.scss';
import Header from './components/header/Header.jsx';
import Dashboard from './components/dashboard/Dashboard.jsx';
import Detail from './components/detail/Detail.jsx';
import ErrorPage from './components/errorPage/ErrorPage.jsx';
function App() {

  return (
    <>
      <Header/>
      <main>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/coin/:id" element={<Detail />} />
        <Route path='*' element={<ErrorPage />}/>
      </Routes>
    </main>
    </>
  );
}

export default App;