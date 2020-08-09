import styled from 'styled-components'

export const Container = styled.div`
    width: 30%;
    color: #FFF;
    text-align: center;
    background-image: radial-gradient( circle 972.6px at 10% 20%,  rgba(243,0,75,1) 0%, rgba(255,93,75,1) 90% );
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin: 10px auto;
    border-radius: 3px;

    @media screen and (max-width: 600px){
        width: 100%;
    }
`
export const Button = styled.button`
    width: 40%;
    height: 45px;
    background-color: transparent;
    color: #FFF;
    border: none;
    border: solid 1px #f1faee;
    border-radius: 4px;
    margin: 10px auto;
    cursor: pointer;
    font-size: 15px;
    text-transform: uppercase;

    &:hover{
        background-color: #ff2c06;
        border-width: 2px;
    }

    @media screen and (max-width: 600px){
        width: 90%;
    }
` 