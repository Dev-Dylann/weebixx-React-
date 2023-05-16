import { useEffect, useState } from "react"
import { DataProvider } from "./context/DataContext";
import { Routes, Route } from 'react-router-dom';
import Layout from "./components/Layout";
import Browse from "./components/Browse";
import Search from "./components/Search"
import Logo from './components/Logo'

function App() {
  const [darkTheme, setDarkTheme] = useState(false);

  useEffect(() => {
    if (darkTheme) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkTheme])

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Browse />} />
        <Route path="search/:query" element={<Search />} />
      </Route>
    </Routes>
  )
}

export default App
