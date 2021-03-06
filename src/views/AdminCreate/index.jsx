import { useState } from 'react'
import { Icon } from '@iconify/react'
import api from '../../services/api'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import Imports from '../../utils/Imports'
import HeaderAdm from '../../components/HeaderAdm'

import { Form, Button } from './styles'
import { Container } from '../../styles/container'

export default function AdminCreate({ match }) {
    //Portfólio
    const [title, setTitle] = useState()
    const [type, setType] = useState(1)
    const [img, setImg] = useState()
    const [github, setGithub] = useState('')
    const [deployLink, setDeployLink] = useState('')
    //Admin
    const [email, setEmail] = useState()
    const [password, setPassword] = useState()

    async function save() {
        if (match.params.create === 'portfolio') {
            if (!title)
                toast.warning('Você precisa informar o título do portfólio!')
            else if (!type)
                toast.warning('Você precisa informar o tipo do portfólio!')
            else if (!img)
                toast.warning('Você precisa inserir a imagem do portfólio!')
            else {
                const formData = new FormData()
                formData.append('title', title)
                formData.append('type', type)
                formData.append('img', img)
                formData.append('githubLink', github)
                formData.append('deployLink', deployLink)

                await api.post('/portfolio', formData)
                .then(() => {
                    toast.success('Portfólio criado com sucesso!')
                    setTitle()
                    setType(1)
                    setImg()
                    setGithub('')
                    setDeployLink('')
                })
                .catch(error => toast.error(error.response.data.error))
            }
        } else if (match.params.create === 'admin') {
            if (!email)
                toast.warning('Você precisa informar o e-mail do admin!')
            else if (!password || password.length < 6)
                toast.warning('A senha precisa ter no mínimo 6 caracteres!')
            else {
                await api.post('/admin', {
                    email,
                    password
                })
                .then(() => {
                    toast.success('Admin criado com sucesso!')
                    setEmail()
                    setPassword()
                })
                .catch(error => toast.error(error.response.data.error))
            }
        }
    }

    return (
        <Imports>
            <Container>
                <HeaderAdm page="create" nameOrTitle={ match.params.create === 'portfolio' ? 'Portfólio' : 'Admin' } />
                { match.params.create === 'portfolio' ?
                    <Form enctype="multipart/form-data">
                        <p>Title</p>
                        <input type="text" onChange={e => setTitle(e.target.value)} value={title || ''} />
                        <p>Tipo</p>
                        <select onChange={e => setType(e.target.value)}>
                            <option value={1}>Design</option>
                            <option value={2}>Aplicativo Web</option>
                            <option value={3}>Aplicativo Mobile</option>
                        </select>
                        <p>Imagem</p>
                        <input type="file" onChange={e => setImg(e.target.files[0])} placeholder={img} />
                        <p>Link do GitHub</p>
                        <input type="text" onChange={e => setGithub(e.target.value)} value={github || ''} />
                        <p>Deploy do projeto</p>
                        <input type="text" onChange={e => setDeployLink(e.target.value)} value={deployLink || ''} />
                    </Form>
                    :
                    <Form>
                        <p>E-mail</p>
                        <input type="email" onChange={e => setEmail(e.target.value)} value={email || ''} />
                        <p>Senha</p>
                        <input type="password" onChange={e => setPassword(e.target.value)} value={password || ''} />
                    </Form>
                }
                <Button onClick={() => save()}>
                    <span><Icon icon="ant-design:save-filled" inline={true} /></span>
                    Salvar
                </Button>
                <ToastContainer position='bottom-right' />
            </Container>
        </Imports>
    )
}