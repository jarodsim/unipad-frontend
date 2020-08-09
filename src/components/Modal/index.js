import React from 'react'
import { Modal as ModaUI } from '@material-ui/core'
import { Container, Button } from './styles.js'

export default function Modal({ showAlertUrlExpired, handleClose, urlPathName }) {
    return (
        <ModaUI
            open={showAlertUrlExpired}
            onClose={handleClose}
        >
            <Container>
                <h1>Atenção!</h1>
                <hr style={{ width: '90%' }} />
                <h2>A url expirou</h2>
                <p>A url {urlPathName} expirou, essa é uma nova url</p>

                <Button onClick={() => handleClose()}>Certo, entendi</Button>
            </Container>

        </ModaUI>
    )
}