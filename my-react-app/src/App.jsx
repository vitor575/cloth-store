import { BrowserRouter, Routes, Route } from "react-router-dom";
import Cadastro from "./components/Cadastro";
import ListaPeca from "./components/ListaPeca";
import Layout from "./components/Layout";
import Vendas from "./components/Vendas";
function App ()  {
  return (
    <BrowserRouter>
      <div>
       <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Cadastro />} />
          <Route path="/lista" element={<ListaPeca />} />
          <Route path="/vendas" element={<Vendas />} />
        </Route>
       </Routes>
      </div>
    </BrowserRouter>
  );
};

export default App;