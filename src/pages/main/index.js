/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react'
import api from '../../service/api'
import cripto from '../../util/encripty'

// editor de Código
import { highlight, languages } from 'prismjs/components/prism-core';
// estilo do editor
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-java';
import 'prismjs/components/prism-c';
import 'prismjs/components/prism-json';
import 'prismjs/components/prism-sql';
import './prism.css';

// styled
import { Header, CopyPad, MenuLeft, MenuRigth, SharePad, MenuButton, FormControlStyled, FormNewUrl, FormEditUrl, FormPasswordUrl, Button, TelaLoading, Textarea } from './styles'
// react-icons
import { MdMenu, MdContentCopy, MdShare, MdArrowBack, MdLockOutline } from 'react-icons/md'
// material-ui
import { Select, MenuItem, InputLabel, Drawer, Divider, FormControl, TextField, InputAdornment, CircularProgress } from '@material-ui/core'
import { makeStyles, ThemeProvider } from '@material-ui/core/styles';

import { theme } from '../tema'

function Main() {
    // estilos personalizados do material-ui
    const x = window.matchMedia("(max-width: 600px)")

    // aplica width de 100% caso a tela seja menor que 600px
    let drawerWidth = '400px'
    let formInputAndSelectWidth = '80%'
    if (x.matches) {
        drawerWidth = '100%'
        formInputAndSelectWidth = '100%'
    }

    const useStyles = makeStyles((theme) => ({
        rawer: {
            width: drawerWidth,
            flexShrink: 0,
        },
        drawerPaper: {
            width: drawerWidth,
            height: '700px',
            color: '#FFF',
            borderBottomRightRadius: '4px',
            background: '#6DD5ED',
        },
        drawerHeader: {
            display: 'flex',
            color: '#FFF',
            alignItems: 'center',
            padding: theme.spacing(0, 1),
            // necessary for content to be below app bar
            ...theme.mixins.toolbar,
            justifyContent: 'space-between',
            height: '70px',
            textAlign: 'center'
        },
        inputLabel: {
            width: formInputAndSelectWidth,
            margin: 'auto',
        },
        formControl: {
            width: '100%',
            display: 'flex',
            marginTop: '10px',
            justifyContent: 'center'
        },
        selectsForm: {
            marginTop: '10px',
            width: formInputAndSelectWidth
        },
    }))
    const classes = useStyles()

    // STATES
    const [format, setFormat] = useState('javascript')
    const [pad, setPad] = useState('')
    const [padSalvo, setPadSalvo] = useState('')
    const [urlPathName, setUrlPathNamel] = useState(window.location.pathname)
    const [url, setUrl] = useState('')
    const [showMenu, setShowMenu] = useState(true)
    const [loading, setLoading] = useState(true)
    const [urlExists, setUrlExists] = useState(true)
    const [password, setPassword] = useState('')
    const [secure, setSecure] = useState(false)
    const [expiration, setExpiration] = useState('')
    const [passed, setPassed] = useState(true)
    const [token, setToken] = useState(null)

    // FUNÇÕES
    useEffect(() => {
        (async () => {
            api.delete('/expiration')
        })()

        // verifica se é uma rota
        if (urlPathName !== '/') {
            (async () => {
                const response = await api.post(`/exists`, {
                    url: urlPathName
                })

                const unipad = response.data

                // caso url não exista
                if (!unipad.success && unipad.description === 'url nao existe') {
                    await createUrl(urlPathName)
                    // caso a url exista
                } else {
                    (async () => {
                        await getUnipadData(urlPathName)
                    })()
                }
            })()
        } else {
            setLoading(false)
        }
    }, [])

    /**
     * recebe a url por parâmetro e busca os dados da mesma
     * @param {urlPathName} url 
     */
    async function getUnipadData(url) {
        const tokenLocalStorage = localStorage.getItem('token')

        if (tokenLocalStorage !== null) {

            const response = await api.get(`${url}`, {
                headers: {
                    authorization: tokenLocalStorage
                }
            })

            const unipad = response.data
            if (unipad.success && unipad.description === 'url encontrada e retornada com sucesso') {
                setPad(unipad.pad)
                setFormat(unipad.format)
                setPassed(true)
                setLoading(false)
                setShowMenu(false)
                return
            }

            if (unipad.success === false && unipad.description === 'id pertencente à outra url') {
                authUrl(urlPathName, '027094dad39dc2757c1d3fa235e12f70')
                getUnipadData(urlPathName)
                return
            }

            if (unipad.success === false && unipad.description === 'token inválido') {
                setLoading(false)
                setPassed(false)
                return
            }

            if (unipad.success === false) {
                setLoading(false)
                setPassed(false)
                return
            }


        } else {

            const responseExistsUrl = await api.post(`/exists`, {
                url: url
            })

            const unipad = responseExistsUrl.data
            if (unipad.secure) {
                setPassed(false)
                setLoading(false)
            }

            // efetuando autenticação com a senha padrão
            let verification = await api.post('/auth', {
                url,
                password: '027094dad39dc2757c1d3fa235e12f70'
            })

            verification = verification.data

            setToken(`Bearer ${verification.token}`)
            localStorage.setItem('token', `Bearer ${verification.token}`)

            // pegando dados do pad
            const response = await api.get(`${url}`, {
                headers: {
                    authorization: `Bearer ${verification.token}`
                }
            })


            const unipadLoged = response.data

            setPad(unipadLoged.pad)
            setFormat(unipadLoged.format)
            setPassed(true)
            setLoading(false)
            return
        }

    }

    /**
     * cria uma url com dados padrões
     * @param {urlPathName} url 
     */
    async function createUrl(url) {
        await api.post(`/new`, {
            url,
            format,
            expiration: null,
            secure: false
        })

        let verification = await api.post('/auth', {
            url,
            password: '027094dad39dc2757c1d3fa235e12f70'
        })

        verification = verification.data

        setToken(`Bearer ${verification.token}`)
        localStorage.setItem('token', `Bearer ${verification.token}`)

        await getUnipadData(url)
        return
    }

    /**
     * cria a url com base nas configs do user
     * @param {preventReload} e 
     */
    async function createUrlSubmit(e) {
        e.preventDefault()

        const responseExistsUrl = await api.post(`/exists`, {
            url: url
        })

        if (responseExistsUrl.data.success) {
            window.location.href = url
            return
        }

        let passwordEncripted = null
        if (password.length > 0) {
            passwordEncripted = cripto(password)
        } else {
            passwordEncripted = '027094dad39dc2757c1d3fa235e12f70'
        }

        await api.post(`/new`, {
            url,
            format,
            expiration,
            secure: password.length > 0 ? !secure : false,
            password: passwordEncripted
        })

        authUrl(url, passwordEncripted)

        window.location.pathname = url
    }

    /**
     * @param {url} url
     * @param {password} passwordEncripted
     */
    async function authUrl(url, password) {
        console.log(url)
        const responseAuth = await api.post(`/auth`, {
            url,
            password
        })

        const auth = responseAuth.data

        setToken(`Bearer ${auth.token}`)
        localStorage.setItem('token', `Bearer ${auth.token}`)
    }

    async function authentication(e) {
        e.preventDefault()
        const passwordEncripted = cripto(password)

        const responseAuth = await api.post(`/auth`, {
            url: urlPathName,
            password: passwordEncripted
        })

        const auth = responseAuth.data

        if (auth.success === false) {
            alert('Ops! Tem certeza que a senha é essa?')
        } else {
            setToken(`Bearer ${auth.token}`)
            localStorage.setItem('token', `Bearer ${auth.token}`)
            getUnipadData(urlPathName)
        }
    }

    async function salva() {
        await api.put(`/edit`, {
            pad, url: urlPathName, format
        })
    }
    return (
        <>
            <ThemeProvider theme={theme}>
                {loading ? (
                    <>
                        <TelaLoading>
                            <CircularProgress color="secondary" />
                            <h1>Carregando pad...</h1>
                        </TelaLoading>
                    </>
                ) :
                    passed ? (
                        <>
                            <Header>
                                <MenuLeft>
                                    <MenuButton onClick={() => setShowMenu((prevState) => !prevState)}>
                                        <MdMenu size={30} color="#FFF" />
                                    </MenuButton>

                                    <FormControlStyled variant="outlined" id="select-head-format">
                                        <InputLabel id="select-head-format">Formato</InputLabel>
                                        <Select
                                            labelId="select-head-format"
                                            value={format}
                                            onChange={e => { setFormat(e.target.value); salva() }}
                                            label="Formato"
                                        >
                                            <MenuItem value="javascript">
                                                javascript
                                            </MenuItem>

                                            <MenuItem value="java">
                                                java
                                            </MenuItem>

                                            <MenuItem value="json">
                                                json
                                            </MenuItem>

                                            <MenuItem value="c">
                                                C
                                            </MenuItem>

                                            <MenuItem value="sql">
                                                SQL
                                            </MenuItem>
                                        </Select>
                                    </FormControlStyled>
                                </MenuLeft>

                                <h1>UNIPAD</h1>

                                <MenuRigth>
                                    <CopyPad text={pad}>
                                        <button onClick={() => alert('PAD copiado para a sua área de transfrência')}>
                                            <MdContentCopy size={30} color="#FFF" />
                                        </button>

                                    </CopyPad>

                                    <SharePad>
                                        <CopyPad text={`unipad.herokuapp.com${urlPathName}`}>
                                            <button onClick={() => alert('Link copiado para a sua área de transfrência')}>
                                                <MdShare size={30} color="#FFF" />
                                            </button>

                                        </CopyPad>
                                    </SharePad>
                                </MenuRigth>
                            </Header>
                            {/* TEXTAREA - PAD */}
                            <Textarea
                                value={pad}
                                onValueChange={pad => setPad(pad)}
                                onKeyUp={salva}
                                highlight={pad => highlight(pad, languages[format])}
                                padding={10}
                                style={{
                                    fontFamily: '"Fira code", "Fira Mono", monospace',
                                    fontSize: 14,
                                }}
                            />


                            {/* MENU */}
                            {urlPathName !== '/' && passed === true ? (
                                // MENU PARA ROTA EXISTENTE
                                <Drawer
                                    variant="persistent"
                                    anchor="left"
                                    open={showMenu}
                                    classes={{
                                        paper: classes.drawerPaper,
                                    }}
                                >
                                    <div className={classes.drawerHeader}>
                                        <h3>UNIPAD</h3>

                                        <MenuButton onClick={e => setShowMenu((prevState) => !prevState)}>
                                            <MdArrowBack size={30} color="#FFF" />
                                        </MenuButton>
                                    </div>
                                    <Divider />
                                    <FormEditUrl>
                                        <h2>Configurações da rota {urlPathName}</h2>

                                        <FormControl variant="outlined" classes={{
                                            root: classes.selectsForm
                                        }}>
                                            <InputLabel id="select-form-format"
                                            >Formato</InputLabel>
                                            <Select
                                                labelId="select-form-format"
                                                value={format}
                                                onChange={e => setFormat(e.target.value)}
                                                label="Formato"
                                            >
                                                <MenuItem value="javascript">
                                                    javascript
                                                </MenuItem>
                                                <MenuItem value="java">
                                                    java
                                                </MenuItem>
                                                <MenuItem value="json">
                                                    json
                                                </MenuItem>
                                                <MenuItem value="c">
                                                    C
                                                </MenuItem>
                                                <MenuItem value="sql">
                                                    SQL
                                                </MenuItem>
                                            </Select>
                                        </FormControl>

                                        <Button onClick={() => salva()}>Salvar</Button>
                                    </FormEditUrl>
                                </Drawer>
                            ) : (
                                    // MENU PARA ROTA NÃO EXISTENTE - CONFIGURADA
                                    <Drawer
                                        variant="persistent"
                                        anchor="left"
                                        open={showMenu}
                                        classes={{
                                            paper: classes.drawerPaper,
                                        }}
                                    >
                                        <div className={classes.drawerHeader}>
                                            <h3>UNIPAD</h3>
                                        </div>
                                        <Divider />
                                        <FormNewUrl onSubmit={(e) => createUrlSubmit(e)}>

                                            <h2>Para começar a usar o serviço é necessário configurar uma rota</h2>

                                            <FormControl classes={{
                                                root: classes.formControl
                                            }}>
                                                <TextField
                                                    label="url"
                                                    type="text"
                                                    variant="outlined"
                                                    required
                                                    classes={{
                                                        root: classes.inputLabel
                                                    }}
                                                    onChange={e => setUrl(`/${e.target.value}`)}
                                                    InputProps={{
                                                        startAdornment: (
                                                            <InputAdornment>
                                                                /
                                                            </InputAdornment>
                                                        )
                                                    }}
                                                >
                                                </TextField>
                                            </FormControl>

                                            <FormControl classes={{
                                                root: classes.formControl
                                            }}>
                                                <TextField
                                                    label="Senha"
                                                    type="password"
                                                    variant="outlined"
                                                    classes={{
                                                        root: classes.inputLabel
                                                    }}
                                                    onChange={e => setPassword(e.target.value)}
                                                    InputProps={{
                                                        startAdornment: (
                                                            <InputAdornment>
                                                                <MdLockOutline />
                                                            </InputAdornment>
                                                        )
                                                    }}
                                                >
                                                </TextField>
                                            </FormControl>

                                            <FormControl variant="outlined" classes={{
                                                root: classes.selectsForm
                                            }}>
                                                <InputLabel id="select-form-format"
                                                >Formato</InputLabel>
                                                <Select
                                                    labelId="select-form-format"
                                                    value={format}
                                                    onChange={e => { setFormat(e.target.value); salva() }}
                                                    label="Formato"
                                                >
                                                    <MenuItem value="javascript">
                                                        javascript
                                                </MenuItem>
                                                    <MenuItem value="java">
                                                        java
                                                </MenuItem>
                                                    <MenuItem value="json">
                                                        json
                                                </MenuItem>
                                                    <MenuItem value="c">
                                                        C
                                                </MenuItem>
                                                    <MenuItem value="sql">
                                                        SQL
                                                </MenuItem>
                                                </Select>
                                            </FormControl>

                                            <FormControl classes={{
                                                root: classes.selectsForm
                                            }}>
                                                <TextField
                                                    variant="outlined"
                                                    label="Data de Expiração"
                                                    type="datetime-local"
                                                    defaultValue="2020-01-01T12:00"
                                                    onChange={(e) => setExpiration(e.target.value)}
                                                />
                                            </FormControl>

                                            <Button type="submit">Salvar</Button>
                                        </FormNewUrl>
                                    </Drawer>
                                )}
                        </>

                    ) : (
                            <Drawer
                                variant="persistent"
                                anchor="left"
                                open={showMenu}
                                classes={{
                                    paper: classes.drawerPaper,
                                }}
                            >
                                <div className={classes.drawerHeader}>
                                    <h3>UNIPAD</h3>
                                </div>
                                <Divider />
                                <h2>A rota {urlPathName} é protegida</h2>

                                <FormPasswordUrl onSubmit={e => authentication(e)}>
                                    <FormControl classes={{
                                        root: classes.formControl
                                    }}>
                                        <TextField
                                            label="Senha"
                                            type="password"
                                            variant="outlined"
                                            classes={{
                                                root: classes.inputLabel
                                            }}
                                            onChange={e => setPassword(e.target.value)}
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment>
                                                        <MdLockOutline />
                                                    </InputAdornment>
                                                )
                                            }}
                                        >
                                        </TextField>
                                    </FormControl>
                                    <Button type="submit">Entrar</Button>
                                </FormPasswordUrl>
                            </Drawer>
                        )
                }
            </ThemeProvider>
        </>
    )
}

export default Main