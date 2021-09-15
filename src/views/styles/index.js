import styled from "styled-components";

const maxWidth = `
  width: 100%;
  max-width: 250px;
  padding: 10px 20px;
`;

const sharedProps = `
  ${maxWidth}
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  font-weight: bold;
`;

export const Wrapper = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  & > * {
    margin-bottom: 0.5em;
  }
`;

export const Input = styled.input`
  ${sharedProps}
  background: #ededed;
  color: black;
  outline: none;
`;

export const Button = styled.button`
  ${sharedProps}
  background: #036ef9;
  color: white;
  cursor: pointer;
`;

export const Image = styled.img`
  max-width: 300px;
  margin-bottom: 3em;
`;

export const H2 = styled.h2`
  margin-bottom: 3em;
`;

export const Message = styled.p`
  padding: 10px 20px;
  text-align: center;
  margin-bottom: 1em;
  color: #036ef9;
  font-weight: bold;
  font-size: 1.2em;
  ${(props) =>
    props.noSpacing &&
    `
		padding: 0;
		margin: 0;
`}
`;
