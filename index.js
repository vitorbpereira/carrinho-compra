import React from 'react'; // Importa a biblioteca React para poder usar componentes
import ReactDOM from 'react-dom'; // Importa ReactDOM para manipular o DOM
import './index.css'; // Importa os estilos globais da aplicação
import App from './App'; // Importa o componente principal App

// Renderiza o componente App dentro do elemento com id 'root'
ReactDOM.render(
  <React.StrictMode> 
    <App /> 
  </React.StrictMode>,
  document.getElementById('root') // Seleciona o elemento HTML onde o App será montado
);
