/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import styled from "styled-components";
import { data } from "../dropDownData";

const StyledSelect = styled.select`
  font-size: 1.4rem;
  padding: 0.8rem 1.2rem;
  border: 1px solid
    ${(props) => (props.type === "white" ? "#f3f4f6" : "#d1d5db")};
  border-radius: 7px;
  background-color: #fff;
  font-weight: 500;
  /* box-shadow: var(--shadow-sm); */
`;

function Select({ options, value, onChange, ...props }) {
  return (
    <StyledSelect value={value} onChange={onChange} {...props}>
      {options.map((option) => (
        <option
          value={option.position}
          key={option.position}
          code={option.code}
        >
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
