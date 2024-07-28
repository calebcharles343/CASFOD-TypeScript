import Logo from "../ui/Logo";
import HeaderLinks from "../ui/HeaderLinks";
import styled from "styled-components";
import { Outlet } from "react-router";

function AppLayout() {
  return (
    <Layout>
      <Logo />
      <HeaderLinks />
      <Main>
        <Outlet />
      </Main>
    </Layout>
  );
}

export default AppLayout;

const Layout = styled.div`
  padding-top: 2%;
  height: 100vh;
`;

const Main = styled.div`
  width: 50%;
  margin: 0 auto;
  overflow-y: scroll;
  height: 80%;

  // &::-webkit-scrollbar {
  // width: 0; /* Remove scrollbar space */
  // background: transparent; //Optional: just make scrollbar invisible
  //}
`;
