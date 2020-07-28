import React from 'react'
import { HeaderInitialPage } from './styles'

export default function MainHeader() {
    return (
        <HeaderInitialPage>
            <h1 onClick={() => { window.location.href = '/' }}>UNIPAD</h1>
        </HeaderInitialPage>
    )
}