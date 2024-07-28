/* eslint-disable no-unused-vars */
import { NavLink } from "react-router-dom";
import styled from "styled-components";

const NavList = styled.ul`
  display: flex;
  gap: 15rem;
  margin: 0 auto;
  align-items: center;
  justify-content: center;
`;

const Li = styled.li`
  text-decoration: none;
`;

const StyledNavLink = styled(NavLink)`
  &:link,
  &:visited {
    display: flex;
    align-items: center;
    gap: 1.2rem;
    font-family: 'Roboto', sans-serif ;

    color: #000000
    font-size: 1.5rem;
    font-weight: 500;
    padding: 1.2rem 2.4rem;
    transition: all 0.3s;
    text-decoration: none;
    border-bottom: 1px solid transparent;
  }

  /* This works because react-router places the active class on the active NavLink */
   &:hover,
  &:active,
  &.active:link,
  &.active:visited {
    color: #ef476f;
    border-bottom: 1px solid #ef476f;
    /* background-color: var(--color-grey-50); */
    
  } 
`;

function HeaderLinks() {
  return (
    <nav>
      <NavList>
        <StyledNavLink to="/payment">
          <span>Payment Voucher</span>
        </StyledNavLink>

        <StyledNavLink to="/purchase">
          <span>Purchase Request</span>
        </StyledNavLink>
      </NavList>
    </nav>
  );
}

export default HeaderLinks;
