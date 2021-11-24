import React from 'react';
import Head from 'next/head'
import styles from '../../styles/Home.module.css'
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import Popup from 'reactjs-popup';
import axios from 'axios';
import Login from '../components/Login';
import Cadastro from '../components/Cadastro';
import Evento from '../components/Evento';

axios.defaults.baseURL = process.env.NEXT_PUBLIC_HOST

export default class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      eventos: [],
      openLogin: false,
      openEvento: false,
      openCadastro: false,
      value: new Date(),
      nome: ""
    }
  }

  componentDidMount() {
    if (localStorage.getItem('token') && localStorage.getItem('nome')) {
      this.setState({ nome: localStorage.getItem('nome'), value: new Date()})
      this.getEventos()
    }
  }

  getEventos = () => {
    if (localStorage.getItem('token') && localStorage.getItem('nome')) {
      const token = localStorage.getItem('token')
      const config = {
        headers: {
          Authorization: 'Bearer ' + token
        }
      };
      axios.get('api/event/get_events', config)
        .then(res => {
          this.setState({
            eventos: res.data
          })
        })
        .catch(err => {
          err ? this.sair() : ''
        })
    }
  }

  filterEventos = () => {
    let eventos = []
    this.state.eventos.map((evento) => {
      const start = new Date(evento.start)
      if (this.state.value.getDate() + "/" + this.state.value.getMonth() === start.getDate() + "/" + start.getMonth()) {
        eventos.push(evento)
      }
    })
    return eventos
  }

  customizeDate = ({ date, view }) => {
    const dia = date.getDate() + "/" + date.getMonth()
    this.state.eventos.map(evento => {
      return view === 'month' && dia === evento.start.getDate() + "/" + evento.start.getMonth() ? styles.haveEvent : null
    })
  }

  handleChangeDate = (value) => {
    if (localStorage.getItem('token') && localStorage.getItem('nome')) {
      this.setState({
        value: value,
        openEvento: true
      })
    }else this.setState({value:value})
  }

  mostrarCadastro = () => {
    this.setState({
      openLogin: false,
      openCadastro: true
    })
  }

  closeModal = () => {
    this.setState({
      openEvento: false,
      openLogin: false
    })
  }

  closeCadastro = () => {
    this.setState({
      openCadastro: false
    })
  }

  sair() {
    localStorage.clear()
    location.reload()
  }

  render() {
    return (
      <div>
        <Head>
          <title>Calendário de Eventos</title>
          <meta name="description" content="Calendário de Eventos feito para o desafio técnico da Tokenlab" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <Popup open={this.state.openEvento} closeOnDocumentClick onClose={this.closeModal}>
          <div className={styles.modalEvento}>
            <a className={styles.close} onClick={this.closeModal}>&times;</a>
            <Evento eventos={this.filterEventos()} dia={this.state.value} />
          </div>
        </Popup>
        <Popup open={this.state.openLogin} onClose={this.closeModal}>
          <div className={styles.modal}>
            <a className={styles.close} onClick={this.closeModal}>&times;</a>
            <Login mostrarCadastro={this.mostrarCadastro} />
          </div>
        </Popup>
        <Popup open={this.state.openCadastro} onClose={this.closeCadastro}>
          <div className={styles.modal}>
            <a className={styles.close} onClick={this.closeCadastro}>&times;</a>
            <Cadastro />
          </div>
        </Popup>
        <div className={styles.header}>
          <h3>Calendário de Eventos</h3>
          {this.state.nome ? <p>Olá, {this.state.nome} &nbsp;&nbsp; <a onClick={this.sair}>SAIR</a></p> : <a onClick={() => this.setState({ openLogin: true })}>LOGIN</a>}
        </div>
        <div className={styles.divCalendario}>
          <Calendar
            className={styles.calendario}
            onChange={this.handleChangeDate}
            value={this.state.value}
          />
        </div>
      </div>
    )
  }

}
