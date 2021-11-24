import React from "react";
import { Formik, Field, Form } from 'formik';
import axios from "axios";
import styles from '../../styles/Evento.module.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEdit, faTrashAlt } from '@fortawesome/free-solid-svg-icons'

export default class Evento extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            inicio: '',
            fim: '',
            descricao: '',
            id: '',
            titulo: 'Cadastrar'
        }
    }

    getFullDate(data) {
        const mes = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro']
        return data.getDate() + " de " + mes[data.getMonth()] + " de " + data.getFullYear()
    }

    getTime(data) {
        const aux = new Date(data);
        let minutos = aux.getMinutes() < 10 ? "0" + aux.getMinutes() :  aux.getMinutes()
        return aux.getHours() + ":" + minutos
    }

    handleChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    testeHoras = (inicio, fim) => {
        if (inicio.getHours() < fim.getHours()) {
            return true
        } else if (inicio.getHours() === fim.getHours() && inicio.getMinutes() < fim.getMinutes()) {
            return true
        } else return false
    }

    testeConflito = (inicio, fim) =>{
        let conflito = []
        this.props.eventos.map((evento) => {
            let start = new Date(evento.start)
            let end = new Date(evento.end)
            let i = new Date(inicio)
            let f = new Date(fim)
            if(this.testeHoras(f, start) || this.testeHoras(end, i)){
                conflito.push(true)
            }else{
                conflito.push(false)
            }
        })
        return conflito.indexOf(false) >=0 ? false : true
    }

    submit = () => {
        if (localStorage.getItem('token') && localStorage.getItem('nome')) {
            const token = localStorage.getItem('token')
            const config = {
                headers: {
                    Authorization: 'Bearer ' + token
                }
            };
            let inicio = new Date(this.props.dia)
            inicio.setHours(this.state.inicio.slice(0, 2), this.state.inicio.slice(3, 5))
            let fim = new Date(this.props.dia)
            fim.setHours(this.state.fim.slice(0, 2), this.state.fim.slice(3, 5))
            if (inicio > new Date()) {
                if (this.testeHoras(inicio, fim)) {
                    if(this.testeConflito(inicio, fim)){
                        const data = {
                            start: inicio,
                            end: fim,
                            description: this.state.descricao
                        }
                        if (this.state.titulo === "Cadastrar") {
                            axios.post('api/event/create_event', data, config)
                                .then(res => {
                                    alert("Evento cadastrado com sucesso!")
                                    location.reload()
                                })
                                .catch(err => {
                                    alert(err.response.data)
                                })
                        } else if (this.state.titulo === "Alterar") {
                            axios.put('api/event/update_event/' + this.state.id, data, config)
                                .then(res => {
                                    alert("Evento alterado com sucesso!")
                                    location.reload()
                                })
                                .catch(err => {
                                    alert(err.response.data)
                                })
                        } else alert("Ocorreu um erro")
                    }else alert("Existe um conflito com um evento já marcado")
                } else alert("A hora de início deve ser menor que a hora de fim")
            } else alert("Você só pode criar eventos em datas futuras")
        } else alert("Você deve fazer login para cadastrar um evento")
    }

    renderEventos = () => {
        if (this.props.eventos[0]) {
            return this.props.eventos.map((evento) => {
                return (
                    <tr key={evento._id}>
                        <td>{this.getTime(evento.start)}</td>
                        <td>{this.getTime(evento.end)}</td>
                        <td>{evento.description}</td>
                        <td>
                            <button className={styles.botaoIcone} onClick={() => this.mostrarEvento(evento)}><FontAwesomeIcon icon={faEdit} /></button>
                            <button className={styles.botaoIcone} onClick={() => this.deletarEvento(evento._id)}><FontAwesomeIcon icon={faTrashAlt} /></button>
                        </td>
                    </tr>
                )
            })
        } else {
            return (<tr><td></td><td>Não há eventos cadastrados</td><td></td></tr>)
        }
    }

    mostrarEvento = (evento) => {
        let inicio = new Date(evento.start)
        let minutosInicio = inicio.getMinutes() > 10 ? inicio.getMinutes() : "0" + inicio.getMinutes()
        let fim = new Date(evento.end)
        let minutosFim = fim.getMinutes() > 10 ? fim.getMinutes() : "0" + fim.getMinutes()
        this.setState({
            titulo: 'Alterar',
            inicio: inicio.getHours() + ":" + minutosInicio,
            fim: fim.getHours() + ":" + minutosFim,
            descricao: evento.description,
            id: evento._id
        })
    }

    deletarEvento = (id) => {
        if (localStorage.getItem('token') && localStorage.getItem('nome')) {
            let confirma = confirm("Você deseja excluir o evento?")
            if (confirma) {
                const token = localStorage.getItem('token')
                const config = {
                    headers: {
                        Authorization: 'Bearer ' + token
                    }
                };
                axios.delete('api/event/delete_event/' + id, config)
                    .then(res => {
                        alert("Evento deletado com sucesso!")
                        location.reload()
                    })
                    .catch(err => {
                        alert(err.response.data)
                    })
            }
        }
    }

    render() {
        return (
            <>
                <h3>{this.getFullDate(this.props.dia)}</h3>
                <div className={styles.eventos}>
                    <div>
                        <h3>Eventos do dia</h3>
                        <table className={styles.tabelaEvento}>
                            <thead>
                                <tr>
                                    <th>Início</th>
                                    <th>Fim</th>
                                    <th>Descrição</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {this.renderEventos()}
                            </tbody>
                        </table>
                    </div>
                    <div>
                        <Formik
                            initialValues={{
                                inicio: '',
                                fim: '',
                                descricao: ''
                            }}
                            onSubmit={this.submit}>
                            <Form className={styles.formEvento}>
                                <h3>{this.state.titulo} evento</h3>
                                <br />
                                <label htmlFor="inicio">Início: </label>
                                <Field type="time" name="inicio" value={this.state.inicio} onChange={this.handleChange} required />
                                <br />
                                <label htmlFor="fim">Fim: </label>
                                <Field type="time" name="fim" value={this.state.fim} onChange={this.handleChange} required />
                                <br />
                                <label htmlFor="descricao">Descrição: </label>
                                <Field type="text" name="descricao" value={this.state.descricao} onChange={this.handleChange} required />
                                <br />
                                <Field type="submit" className={styles.botaoEvento} value={this.state.titulo} name="botaologin" />
                            </Form>
                        </Formik>
                    </div>
                </div>
            </>
        )
    }
}