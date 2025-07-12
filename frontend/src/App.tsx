import { BrowserRouter, Routes, Route } from "react-router-dom";

import Review from "./page/review/index"
import Home from "./page/index"

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/review" element={<Review />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
