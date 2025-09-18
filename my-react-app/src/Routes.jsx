import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router";
import Cadastro from "./components/Cadastro"

const Routes = () => {
  return (
    <BrowserRouter>
      <Cadastro />
    </BrowserRouter>
  );
};

export default Routes;
