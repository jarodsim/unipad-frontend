import styled from 'styled-components'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import { FormControl } from '@material-ui/core'
import Editor from 'react-simple-code-editor';

export const Header = styled.header`
    width: 100%;
    height: 70px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: #FFF;
    background-image: radial-gradient( circle 972.6px at 10% 20%,  rgba(243,0,75,1) 0%, rgba(255,93,75,1) 90% );
`

export const CopyPad = styled(CopyToClipboard)`
    background-color: transparent;
    border: none;
    outline: none;
    cursor: pointer;
`

export const SharePad = styled(CopyToClipboard)`
    background-color: transparent;
    border: none;
    outline: none;
    cursor: pointer;

`

export const MenuLeft = styled.div`
   display: flex;
   align-items: center;
   justify-content: center;
   margin: 3px;
`

export const MenuRigth = styled.div`
   display: flex;
   align-items: center;
   justify-content: center;
   margin: 3px;
`

export const MenuButton = styled.button`
    margin-right: 3px;
    background-color: transparent;
    border: none;
    outline: none;
    cursor: pointer;
`

export const FormControlStyled = styled(FormControl)`
    width: 140px;
`

export const FormNewUrl = styled.form`
    width: 100%;
    height: auto;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;

    h2{
        width: 80%;
    }
`

export const FormEditUrl = styled.div`
    width: 100%;
    height: auto;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;

    h2{
        width: 90%;
    }

    @media screen and (max-width: 600px){
        height: auto;
    }
`

export const FormPasswordUrl = styled.form`
    width: 100%;
    height: 700px;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;

    h2{
        width: 90%;
    }
`

export const Button = styled.button`
    width: 80%;
    height: 45px;
    background-color: transparent;
    color: #FFF;
    border: none;
    border: solid 1px #f1faee;
    border-radius: 4px;
    margin-top: 10px;
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

export const ButtonNewUrl = styled.button`
    width: 80%;
    margin: auto;
    height: 45px;
    background-color: transparent;
    color: #FFF;
    border: none;
    border: solid 1px #f1faee;
    border-radius: 4px;
    margin-top: 10px;
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

export const Textarea = styled(Editor)`
    width: 100%;
    min-height: 90vh;
    border-radius: 2px;
    background-color: #FFF;
    color: black;
    resize: none;
    border: none;
    outline: none;
`

export const Footer = styled.footer`
    width: 100%;
    height: 100px;
    bottom: 0;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
    position: absolute;
    left: 0;
    bottom: 0;

    small {
        a{
            text-decoration: none;
            color: #e5e5e5;
        }
    }
`