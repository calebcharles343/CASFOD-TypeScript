import styled, { css } from "styled-components";
// import { UseFormReset } from "react-hook-form";
// import { FormValues } from "../interfaces";
interface InputProps {
  size?: string;
  // reset?: UseFormReset<FormValues>;
}

const Input = styled.input<InputProps>`
  border: 2px solid #ced4da;
  background-color: #fff;
  border-radius: 7px;
  padding: 0.8rem 1.2rem;
  ${(props) =>
    props.size === "wide" &&
    css`
      width: 100%;
    `};
`;

export default Input;
