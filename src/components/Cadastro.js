import styles from '../../styles/Login.module.css'
import { Formik, Field, Form } from 'formik';
import axios from 'axios';
import React from 'react';

export default class Cadastro extends React.Component {

    handleCadastro = e => {
        const data = {
            name: {
                firstName: e.nome,
                lastName: e.sobrenome
            },
            email: e.email,
            password: e.senha
        }
        axios.post('api/user/signup', data)
            .then(res => {
                alert("Cadastro realizado com sucesso!")
                location.reload()
            })
            .catch(err => {
                alert(err.response.data)
            })
    }

    render() {
        return (
            <div className={styles.login}>
                <h3>Cadastro</h3>
                <Formik
                    initialValues={{
                        email: '',
                        senha: '',
                        nome: '',
                        sobrenome: ''
                    }}
                    onSubmit={this.handleCadastro}>
                    <Form className={styles.formLogin}>
                        <Field type="text" placeholder="Nome" name="nome" required />
                        <br />
                        <Field type="text" placeholder="Sobrenome" name="sobrenome" required />
                        <br />
                        <Field type="email" placeholder="E-mail" name="email" required />
                        <br />
                        <Field type="password" placeholder="Senha" name="senha" minLength="8" required />
                        <br />
                        <Field type="submit" className={styles.botaoLogin} value="Cadastrar" name="botaologin" />
                    </Form>
                </Formik>
            </div>
        )
    }
}