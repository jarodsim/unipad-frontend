/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react'
import api from '../../service/api'
import cripto from '../../util/encripty'
import dateFormated from '../../util/dateFomatSelect'

// editor de Código
import { highlight, languages } from 'prismjs/components/prism-core'
// estilo do editor
import 'prismjs/components/prism-clike'
import 'prismjs/components/prism-javascript'
import 'prismjs/components/prism-java'
import 'prismjs/components/prism-c'
import 'prismjs/components/prism-json'
import 'prismjs/components/prism-sql'
import 'prismjs/components/prism-markup'
import 'prismjs/components/prism-css'
import 'prismjs/components/prism-typescript'
import 'prismjs/components/prism-jsx'
import 'prismjs/components/prism-go'
import 'prismjs/components/prism-markdown'
import 'prismjs/components/prism-python'
import './prism.css'

// styled
import { Header, CopyPad, MenuLeft, MenuRigth, SharePad, MenuButton, FormNewUrl, FormEditUrl, FormPasswordUrl, Button, Textarea, Footer, ButtonNewUrl } from './styles'
//components
import MainHeader from '../../components/MainHeader'
import Loading from '../../components/Loading'
import Modal from '../../components/Modal'
// react-icons
import { MdMenu, MdContentCopy, MdShare, MdArrowBack, MdLockOutline } from 'react-icons/md'
// material-ui
import { Select, MenuItem, InputLabel, Drawer, Divider, FormControl, TextField, InputAdornment } from '@material-ui/core'
import { makeStyles, ThemeProvider } from '@material-ui/core/styles'

import { theme } from '../tema'

function Main() {
    // estilos personalizados do material-ui
    const x = window.matchMedia("(max-width: 600px)")

    // aplica width de 100% caso a tela seja menor que 600px
    let drawerWidth = '400px'
    let formInputAndSelectWidth = '80%'
    if (x.matches) {
        drawerWidth = '100%'
        formInputAndSelectWidth = '90%'
    }

    const useStyles = makeStyles((theme) => ({
        rawer: {
            width: drawerWidth,
            flexShrink: 0,
        },
        drawerPaper: {
            width: drawerWidth,
            textAlign: 'center',
            height: '100%',
            color: '#FFF',
            borderBottomRightRadius: '4px',
            backgroundImage: 'radial-gradient( circle 972.6px at 10% 20%,  rgba(243,0,75,1) 0%, rgba(255,93,75,1) 90% )'
        },
        drawerHeader: {
            display: 'flex',
            color: '#FFF',
            alignItems: 'center',
            padding: theme.spacing(0, 1),
            // necessary for content to be below app bar
            ...theme.mixins.toolbar,
            justifyContent: 'center',
            height: '70px',
            width: '80%',
            margin: '0 auto 0 auto',
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
    const [urlPathName, setUrlPathNamel] = useState(window.location.pathname)
    const [url, setUrl] = useState('')
    const [showMenu, setShowMenu] = useState(true)
    const [loading, setLoading] = useState(true)
    const [password, setPassword] = useState('')
    const [secure, setSecure] = useState(false)
    const [expiration, setExpiration] = useState(null)
    const [passed, setPassed] = useState(true)
    const [initialPage, setInitialPage] = useState(true)
    const [openModal, setOpenModal] = useState(false)
    const [disableInput, setDisableInput] = useState(false)
    const [showAlertUrlExpired, setShowAlerUrlExpired] = useState(false)

    // FUNÇÕES
    useEffect(() => {
        (async () => {

            await api.delete('/expiration')

            // verifica se é uma rota
            if (urlPathName !== '/') {
                const response = await api.post(`/exists`, {
                    url: urlPathName
                })
                const unipad = response.data

                // validar se a url esta expirada e exiba o alert
                await showAlertExpiredUrl(urlPathName)

                // caso url não exista
                if (!unipad.success && unipad.description === 'url nao existe') {
                    await createUrl(urlPathName)
                } else {
                    // validar se a url esta expirada e exiba o alert
                    await showAlertExpiredUrl(urlPathName)

                    // caso a url exista
                    await getUnipadData(urlPathName, unipad)
                }
            } else {
                setLoading(false)
            }
        })()
    }, [])

    /**
     * recebe a url por parâmetro e busca os dados da mesma
     * @param {urlPathName} url
     * @param {existsData} unipad  
     */
    async function getUnipadData(url, existsData) {
        // verificando se há tokens no localStorage
        let tokenLocalStorage = localStorage.getItem('token')

        // Caso dê problemas como token ele será ignorado
        if (tokenLocalStorage === 'Bearer undefined') {
            tokenLocalStorage = null
        }

        if (tokenLocalStorage !== null) {
            const responseUrlExists = await api.post(`/exists`, {
                url
            })
            const urlExists = responseUrlExists.data

            // pegando dados da url utilizando o token do localStorage
            const response = await api.get(`${url}`, {
                headers: {
                    authorization: tokenLocalStorage
                }
            })
            const unipad = response.data

            // caso sucesso
            if (unipad.success && unipad.description === 'url encontrada e retornada com sucesso') {
                setPad(unipad.pad)
                setFormat(unipad.format)
                setPassed(true)
                setInitialPage(false)
                setLoading(false)
                setShowMenu(false)
                return
            }

            /**
             * caso erro,a url não seja protegida por senha e a descirção bata
             * será feito login com a senha padrão e a função é chamada novamente
             */
            if (unipad.success === false && urlExists.secure === false && unipad.description === 'id pertencente à outra url') {
                authUrl(urlPathName, '027094dad39dc2757c1d3fa235e12f70')
                getUnipadData(urlPathName)
                return
            }

            /**
             * caso erro e a url seja desprotegida (e a condição de cima seja false)
             * será feito login com a senha padrão e a função é chamada novamente
             */
            if (unipad.success === false && urlExists.secure === false) {
                authUrl(urlPathName, '027094dad39dc2757c1d3fa235e12f70')
                getUnipadData(urlPathName)
                return
            }

            /**
             * caso erro e o token seja inválido a tela de login aparecerá
             */
            if (unipad.success === false && unipad.description === 'token inválido') {
                setLoading(false)
                setPassed(false)
                return
            }

            /**
             * caso todas as condições falhe, a tela de login será exibida
             */
            if (unipad.success === false) {
                setLoading(false)
                setPassed(false)
                return
            }
        } else {

            /**
             * caso não haja token
             */
            const unipad = existsData

            // se a url for protegida por senha, irá exibir a tela de login
            if (unipad.secure) {
                setPassed(false)
                setLoading(false)
                return
            }

            // efetuando autenticação com a senha padrão
            let verification = await api.post('/auth', {
                url,
                password: '027094dad39dc2757c1d3fa235e12f70'
            })
            verification = verification.data

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
            setInitialPage(false)
            setPassed(true)
            setShowMenu(false)
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
        setDisableInput(true)
        await showAlertExpiredUrl(url)

        // senhas masi utilizadas e fáceis de quebrar para verificar se a senha do user é segura
        const passwords = [
            '123', '1234', '12345', '123456', '1234567', '12345678',
            '123456789', 'qwe123', '321', '4321', '54321', '654321', '7654321',
            '87654321', '987456321', 'senha', 'abc', 'abcd', 'password', 'qwerty',
            '1111', 'iloveyou', 'admin', 'abc123', 'qwerty123'
        ]
        const segura = passwords.find((senha) => senha === password)

        if (segura) {
            alert('Ops, coloque uma senha mais segura!')
            return
        }

        // verifica se a url já exista, caso exista o usuário é redirecionado à página da mesma
        const responseExistsUrl = await api.post(`/exists`, {
            url: url
        })

        if (responseExistsUrl.data.success) {
            window.location.href = url
            return
        }

        /**
         * encripta a senha caso o usuário digite alguma senha
         * caso o usuário não coloque uma senha, a senha padrão será 123, encriptada
         */
        let passwordEncripted = null
        if (password.length > 0) {
            passwordEncripted = cripto(password)
        } else {
            passwordEncripted = '027094dad39dc2757c1d3fa235e12f70'
        }

        // criando a url
        await api.post(`/new`, {
            url,
            format,
            expiration: expiration !== null ? new Date(expiration.getTime() + 3 * 3600000) : null,
            secure: password.length > 0 ? !secure : false,
            password: passwordEncripted
        })

        // efetuando login para que o token já esteja no localStorage para não precisar fazer login novamente
        authUrl(url, passwordEncripted)

        // redirecionando o user para a página da URL
        window.location.pathname = url
    }

    /**
     * autentica o user e guarda o token no localStorage
     * @param {url} url
     * @param {password} passwordEncripted
     */
    async function authUrl(url, password) {
        const responseAuth = await api.post(`/auth`, {
            url,
            password
        })

        const auth = responseAuth.data
        localStorage.setItem('token', `Bearer ${auth.token}`)
    }

    /**
     * verifica se a senha está correta e autentica o user
     * @param {peventDefault} e 
     */
    async function authentication(e) {
        setDisableInput(true)
        e.preventDefault()

        // encripta o password
        const passwordEncripted = cripto(password)

        const responseAuth = await api.post(`/auth`, {
            url: urlPathName,
            password: passwordEncripted
        })
        const auth = responseAuth.data

        if (auth.success === false) {
            alert('Ops! Tem certeza que a senha é essa?')
            setDisableInput(false)
        } else {
            localStorage.setItem('token', `Bearer ${auth.token}`)
            getUnipadData(urlPathName)
        }
    }

    // debounce básico
    function debounce(func, wait, immediate) {
        var timeout;
        return function () {
            var context = this, args = arguments;
            var later = function () {
                timeout = null;
                if (!immediate) func.apply(context, args);
            };
            var callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func.apply(context, args);
        };
    };

    /**
     * a cada alteração no pad, atualiza o mesmo
     */
    const salva = debounce(async function () {
        await api.put(`/edit`, {
            pad, url: urlPathName, format
        })
    }, 500)

    /**
     * função para o modal de aviso de data expirada
     */
    const handleClose = () => {
        setShowAlerUrlExpired(false)
    }

    /**
     * função para verificar se a url esta expirada e exibir para o user
     * @param {urlPathName} url 
     */
    async function showAlertExpiredUrl(url) {
        const responseExpiredUrl = await api.post('/verifyExpiredUrl', {
            url: `/pad${url}`
        })

        if (responseExpiredUrl.data.success && !responseExpiredUrl.data.viwed) {
            await setShowAlerUrlExpired(true)
        }
    }
    return (
        <>
            <ThemeProvider theme={theme}>
                {loading ? (
                    <>
                        <Loading />
                    </>
                ) :
                    passed ? (
                        <>
                            {!initialPage ? (
                                <>
                                    <Header>
                                        <MenuLeft>
                                            <MenuButton onClick={() => setShowMenu((prevState) => !prevState)}>
                                                <MdMenu size={30} color="#FFF" />
                                            </MenuButton>

                                        </MenuLeft>

                                        <h1 onClick={() => { window.location.href = '/' }}>UNIPAD</h1>

                                        <MenuRigth>
                                            <CopyPad text={pad}>
                                                <button onClick={() => alert('Pad copiado para a sua área de transferência')}>
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

                                    {/* MODAL PARA CASO A URL ESTEJA EXPIRADA */}
                                    {showAlertUrlExpired ? (
                                        <Modal showAlertUrlExpired={showAlertUrlExpired} handleClose={handleClose} urlPathName={urlPathName} />
                                    ) : ''}
                                </>

                            ) : (
                                    <MainHeader />
                                )}


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
                                        <h3 onClick={() => { window.location.href = '/' }}>CONFIGURAÇÃO DA URL</h3>

                                        <MenuButton onClick={e => setShowMenu((prevState) => !prevState)}>
                                            <MdArrowBack size={30} color="#FFF" />
                                        </MenuButton>
                                    </div>
                                    <Divider />
                                    <FormEditUrl>
                                        <h2>unipad.herokuapp.com <br /> <strong>{urlPathName}</strong></h2>

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
                                                    c
                                                </MenuItem>
                                                <MenuItem value="css">
                                                    css
                                                </MenuItem>
                                                <MenuItem value="sql">
                                                    slq
                                                </MenuItem>
                                                <MenuItem value="markup">
                                                    html/markup
                                                </MenuItem>
                                                <MenuItem value="typescript">
                                                    typescript
                                                </MenuItem>
                                                <MenuItem value="jsx">
                                                    jsx
                                                </MenuItem>
                                                <MenuItem value="go">
                                                    GO
                                                </MenuItem>
                                                <MenuItem value="markdown">
                                                    text/markdown
                                                </MenuItem>
                                                <MenuItem value="python">
                                                    python
                                                </MenuItem>
                                            </Select>
                                        </FormControl>

                                        <Button onClick={() => salva()}>Salvar</Button>
                                    </FormEditUrl>
                                    <ButtonNewUrl onClick={() => { window.location.href = '/' }}>Nova Url</ButtonNewUrl>
                                    <Footer>
                                        <small>Desenvolvido por: <a href="https://jarodmateus.herokuapp.com/" target="_blanck">Jarod Cavalcante</a> </small>
                                    </Footer>
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
                                            <h3>NOVA URL</h3>
                                        </div>
                                        <Divider />
                                        <FormNewUrl onSubmit={(e) => createUrlSubmit(e)}>

                                            <h2>Crie uma url e clique em "ir" para começar!</h2>

                                            <FormControl classes={{
                                                root: classes.formControl
                                            }}>
                                                <TextField
                                                    label="url"
                                                    type="text"
                                                    variant="outlined"
                                                    required
                                                    disabled={disableInput}
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
                                                    label="Senha (opcional)"
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
                                                        c
                                                </MenuItem>
                                                    <MenuItem value="css">
                                                        css
                                                </MenuItem>
                                                    <MenuItem value="sql">
                                                        slq
                                                </MenuItem>
                                                    <MenuItem value="markup">
                                                        html/markup
                                                </MenuItem>
                                                    <MenuItem value="typescript">
                                                        typescript
                                                </MenuItem>
                                                    <MenuItem value="jsx">
                                                        jsx
                                                </MenuItem>
                                                    <MenuItem value="go">
                                                        GO
                                                </MenuItem>
                                                    <MenuItem value="markdown">
                                                        text/markdown
                                                </MenuItem>
                                                    <MenuItem value="python">
                                                        python
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
                                                    defaultValue={dateFormated}
                                                    onChange={(e) => setExpiration(new Date(e.target.value))}
                                                    inputProps={{
                                                        min: dateFormated
                                                    }}
                                                />
                                            </FormControl>

                                            <Button type="submit">Ir</Button>
                                        </FormNewUrl>
                                        <Footer>
                                            <small>Desenvolvido por: <a href="https://jarodmateus.herokuapp.com/" target="_blanck">Jarod Cavalcante</a> </small>
                                        </Footer>
                                    </Drawer>
                                )}
                        </>

                    ) : (
                            // MENU PARA AUTENTICAÇÃO
                            <Drawer
                                variant="persistent"
                                anchor="left"
                                open={showMenu}
                                classes={{
                                    paper: classes.drawerPaper,
                                }}
                            >
                                <div className={classes.drawerHeader}>
                                    <h3 onClick={() => { window.location.href = '/' }}>UNIPAD</h3>
                                </div>
                                <Divider />
                                <h2>A url {urlPathName} é protegida</h2>

                                <FormPasswordUrl onSubmit={e => authentication(e)}>
                                    <FormControl classes={{
                                        root: classes.formControl
                                    }}>
                                        <TextField
                                            label="Senha"
                                            type="password"
                                            variant="outlined"
                                            disabled={disableInput}
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
                                <Footer>
                                    <small>Desenvolvido por: <a href="https://jarodmateus.herokuapp.com/" target="_blanck">Jarod Cavalcante</a> </small>
                                </Footer>
                            </Drawer>
                        )
                }
            </ThemeProvider>
        </>
    )
}

export default Main