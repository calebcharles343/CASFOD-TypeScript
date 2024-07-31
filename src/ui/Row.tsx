import styled, { css } from "styled-components";
import { RowProps } from "../interfaces";

const Row = styled.div<RowProps>`
  display: flex;
  align-content: center;

  ${(props) =>
    props.type === "horizontal" &&
    css`
      justify-content: space-between;
      align-items: center;
      gap: 1.6rem;
    `}
`;

Row.defaultProps = {
  type: "horizontal",
};

export default Row;
