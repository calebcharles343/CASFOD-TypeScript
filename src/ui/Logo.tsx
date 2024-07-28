<style>
  @import
  url("https://fonts.googleapis.com/css2?family=Merriweather:ital,wght@0,300;0,400;0,700;0,900;1,300;1,400;1,700;1,900&family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=swap");
</style>;
import styled from "styled-components";
import logo from "../../src/assets/logo.png";

const StyledLogo = styled.div`
  text-align: center;
  display: flex;
  gap: 3rem;
  align-items: center;
  width: 60%;
  margin: 0 auto;
  margin-bottom: 2rem;
  justify-content: center;
  /* border-bottom: 0.5px solid #495057; */
`;

const Img = styled.img`
  height: 5rem;
  width: auto;
`;

const Heading = styled.h1`
  font-size: 1.5rem;
  font-family: "Merriweather", serif;
  font-weight: 300;
  font-style: normal;
  text-transform: uppercase;
  color: #495057;
`;

function Logo() {
  return (
    <StyledLogo>
      <Img src={logo} alt="Logo" />
      <Heading>
        Unique Care And Support Foundation <br />
        (CASFOD)
      </Heading>
    </StyledLogo>
  );
}

export default Logo;
