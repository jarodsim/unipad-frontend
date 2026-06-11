import styled from 'styled-components'

export const Container = styled.div`
  width: 100%;
  height: 100vh;
  margin: auto;
  color: #fff;
  background-image: radial-gradient(
    circle 972.6px at 10% 20%,
    rgba(243, 0, 75, 1) 0%,
    rgba(255, 93, 75, 1) 90%
  );
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: absolute;
  z-index: 100000;
`
