import { Route, Routes } from 'react-router-dom';
import './App.scss';
import Header from './components/header/Header';
import Coins from './components/coins/Coins';
import Detail from './components/detail/Detail';
import ErrorPage from './components/errorPage/ErrorPage';
import Top10 from './components/top-10/Top-10';
import Favorites from './components/favorites/Favorites';

function App() {
  return (
    <div className="app">
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<Coins />} />
          <Route path="/detail/:id" element={<Detail />} />
          <Route path="/top-10" element={<Top10 />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="*" element={<ErrorPage />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;