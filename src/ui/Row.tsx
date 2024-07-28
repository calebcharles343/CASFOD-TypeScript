import styled, { css } from "styled-components";

const Row = styled.div`
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
