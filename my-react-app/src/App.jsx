import { BrowserRouter, Routes, Route } from "react-router-dom";
import Cadastro from "./components/Cadastro";
import ListaPeca from "./components/ListaPeca";

function App ()  {
  return (
    <BrowserRouter>
      <div>
        <Routes>
          <Route path="/" element={<Cadastro />} />
          <Route path="/lista" element={<ListaPeca />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
};

export default App;