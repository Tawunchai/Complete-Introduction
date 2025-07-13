import { BrowserRouter, Routes, Route } from "react-router-dom";

import Review from "./page/review/index"
import Home from "./page/user/product"
import Navbar from "./component/navbar"

const App = () => {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin" element={<Review />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
