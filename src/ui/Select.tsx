/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import styled from "styled-components";
import { OptionProps, SelectProps } from "../interfaces";
import { ChangeEvent } from "react";

interface StyledSelectT {
  type: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

const StyledSelect = styled.select<StyledSelectT>`
  font-size: 1.4rem;
  padding: 0.8rem 1.2rem;
  border: 1px solid
    ${(props) => (props.type === "white" ? "#f3f4f6" : "#d1d5db")};
  border-radius: 7px;
  background-color: #fff;
  font-weight: 500;
  /* box-shadow: var(--shadow-sm); */
`;

function Select({ options, value, onChange, ...props }: SelectProps) {
  return (
    <StyledSelect value={value} onChange={onChange} {...props}>
      {options.map((option: OptionProps) => (
        <option value={option.position} key={option.position}>
          {option.position}
        </option>
      ))}
    </StyledSelect>
  );
}

export default Select;

//

//

//
//
//
