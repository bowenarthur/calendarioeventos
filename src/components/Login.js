import styles from '../../styles/Login.module.css'
import { Formik, Field, Form } from 'formik';
import axios from 'axios';
import React from 'react';

export default class Login extends React.Component {

    constructor(props) {
        super(props);
    }

    handleLogin = e => {
        const data = {
            email: e.emaillogin,
            password: e.senhalogin
        }
        axios.post('api/user/login', data)
            .then(res => {
                localStorage.setItem('token', res.data.token)
                localStorage.setItem('nome', res.data.firstName)
                location.reload()
            })
            .catch(err => {
                alert(err.response.data)
            })
    }

    render() {
        return (
            <div className={styles.login}>
                <h3>Login</h3>
                <Formik
                    initialValues={{
                        emaillogin: '',
                        senhalogin: '',
                    }}
                    onSubmit={this.handleLogin}>
                    <Form className={styles.formLogin}>
                        <Field type="email" placeholder="E-mail" name="emaillogin" required />
                        <br />
                        <Field type="password" placeholder="Senha" name="senhalogin" minLength="8" required />
                        <br />
                        <p>Ainda não possui cadastro? <button className={styles.botaoTexto} onClick={this.props.mostrarCadastro}>Cadastrar</button></p>
                        <Field type="submit" className={styles.botaoLogin} value="Entrar" name="botaologin" />
                    </Form>
                </Formik>
            </div>
        )
    }
}