import React from 'react'
import { TelaLoading } from './styles'

import { CircularProgress } from '@material-ui/core'

export default function Loading() {
    return (
        <TelaLoading>
            <CircularProgress color="secondary" />
            <h1>Carregando pad...</h1>
        </TelaLoading>
    )
}