// import Form from "./Form";
// import styled from "styled-components";
// import Logo from "./ui/Logo";
// import HeaderLinks from "./ui/HeaderLinks";
import { Navigate, Route, Routes } from "react-router";
import PaymentVoucher from "./pages/PaymentVoucherForm";
import PurchaseRequest from "./pages/PurchaseRequestForm";
import AppLayout from "./pages/AppLayout";
import GlobalStyles from "../styles/GlobalStyles";
import { BrowserRouter } from "react-router-dom";

function App() {
  return (
    <>
      <GlobalStyles />
      <BrowserRouter>
        <Routes>
          <Route element={<AppLayout />}>
            <Route index element={<Navigate replace to="payment" />} />
            <Route path="payment" element={<PaymentVoucher />} />
            <Route path="purchase" element={<PurchaseRequest />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;

// const Page = styled.div`
//   background-color: #f8f9fa;
// `;
