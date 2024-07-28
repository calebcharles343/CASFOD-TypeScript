/* eslint-disable no-unused-vars */
import styled, { css } from "styled-components";
import { ButtonProps } from "../interfaces";

const Button = styled.button<ButtonProps>`
  border: none;
  border-radius: 10px;
  width: 30%;
  align-self: center;
  color: #fff;
  background-color: #20c997;

  ${(props) =>
    props.size === "small" &&
    css`
      font-size: 1.2rem;
      padding: 0.4rem 0.8rem;
      text-transform: uppercase;
      font-weight: 600;
      text-align: center;
    `}
  ${(props) =>
    props.size === "medium" &&
    css`
      font-size: 1.4rem;
      padding: 1.2rem 1.6rem;
      font-weight: 500;
    `}
  ${(props) =>
    props.size === "large" &&
    css`
      font-size: 1.6rem;
      padding: 1.2rem 2.4rem;
      font-weight: 500;
    `}
  &:hover {
    background-color: #38d9a9;
  }

  &:hover {
    transition: all 0.2s ease-in-out;
  }
`;

// Button.defaultProps = {
//   // variation: "primary",
//   size: "medium",
// };

export default Button;
