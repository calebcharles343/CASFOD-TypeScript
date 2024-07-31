import styled, { css } from "styled-components";
import { FormProps } from "../interfaces";

const Form = styled.form<FormProps>`
  display: flex;
  flex-direction: column;
  justify-content: center;

  ${(props) =>
    props.type === "regular" &&
    css`
      padding: 2.4rem 4rem;
    `}

  overflow: hidden;
  font-size: 1.4rem;
`;

Form.defaultProps = {
  type: "regular",
};

export default Form;
