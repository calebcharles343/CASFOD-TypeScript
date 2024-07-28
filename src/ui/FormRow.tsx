/* eslint-disable react/prop-types */
import styled, { css } from "styled-components";
import { FormRowProps, StyledFormRowProps } from "../interfaces";

const StyledFormRow = styled.div<StyledFormRowProps>`
  display: flex;
  flex-direction: column;
  /* align-items: left; */
  width: 40%;

  padding: 1.2rem 0;

  ${(props) =>
    props.type === "large" &&
    css`
      width: 70%;
      align-items: left;
    `}

  ${(props) =>
    props.type === "medium" &&
    css`
      width: 50%;
    `}

  ${(props) =>
    props.type === "small" &&
    css`
      width: 25%;
    `}
`;

const Label = styled.label`
  font-weight: 500;
`;

const Error = styled.span`
  font-size: 1.4rem;
  color: #f03e3e;
`;

function FormRow({ label, error, children, type }: Partial<FormRowProps>) {
  return (
    <StyledFormRow type={type}>
      {label && <Label htmlFor={children.props.id}>{label}</Label>}
      {children}
      {error && <Error>{error}</Error>}
    </StyledFormRow>
  );
}

export default FormRow;
