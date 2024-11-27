import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css'; 
// URL base da API
const API_URL = 'http://localhost:5181/Gerenciador';

function App() {
  const [funcionarios, setFuncionarios] = useState([]);
  const [tarefas, setTarefas] = useState([]);
  const [newFuncionario, setNewFuncionario] = useState('');
  const [newFuncionarioCpf, setNewFuncionarioCpf] = useState('');
  const [newTarefa, setNewTarefa] = useState('');
  const [funcionarioId, setFuncionarioId] = useState('');

  // Função para listar funcionários
  const fetchFuncionarios = async () => {
    try {
      const response = await axios.get(`${API_URL}/funcionario/listar`);
      setFuncionarios(response.data);
    } catch (error) {
      console.error('Erro ao buscar funcionários', error);
    }
  };

  // Função para listar tarefas
  const fetchTarefas = async () => {
    try {
      const response = await axios.get(`${API_URL}/tarefa/listar`);
      setTarefas(response.data);
    } catch (error) {
      console.error('Erro ao buscar tarefas', error);
    }
  };

  // Função para cadastrar funcionário
  const addFuncionario = async () => {
    if (!newFuncionario) return;

    const funcionario = { nome: newFuncionario, Cpf: newFuncionarioCpf };
    try {
      await axios.post(`${API_URL}/funcionario/cadastrar`, funcionario);
      setNewFuncionario('');
      setNewFuncionarioCpf('');
      fetchFuncionarios();
    } catch (error) {
      console.error('Erro ao cadastrar funcionário', error);
    }
  };

  // Função para cadastrar tarefa
  const addTarefa = async () => {
    if (!newTarefa || !funcionarioId) return;

    const tarefa = { descricao: newTarefa, funcionarioId: parseInt(funcionarioId) };
    try {
      await axios.post(`${API_URL}/tarefa/cadastrar`, tarefa);
      setNewTarefa('');
      setFuncionarioId('');
      fetchTarefas();
    } catch (error) {
      console.error('Erro ao cadastrar tarefa', error);
    }
  };

  // Função para deletar tarefa
  const deleteTarefa = async (id) => {
    try {
      await axios.delete(`${API_URL}/tarefa/deletar/${id}`);
      fetchTarefas();
    } catch (error) {
      console.error('Erro ao deletar tarefa', error);
    }
  };

  // Função para deletar funcionário
  const deleteFuncionario = async (id) => {
    try {
      await axios.delete(`${API_URL}/funcionario/deletar/${id}`);
      fetchFuncionarios();
    } catch (error) {
      console.error('Erro ao deletar funcionário', error);
    }
  };

  // Carregar dados ao montar o componente
  useEffect(() => {
    fetchFuncionarios();
    fetchTarefas();
  }, []);

  return (
    <div className="App">
      <h1>Gerenciador de Funcionários e Tarefas</h1>

      <div>
        <h2>Cadastrar Funcionário</h2>
        <input
          type="text"
          value={newFuncionario}
          onChange={(e) => setNewFuncionario(e.target.value)}
          placeholder="Nome do Funcionário"
        />
        <input
          type="number"
          value={newFuncionarioCpf}
          onChange={(e) => setNewFuncionarioCpf(e.target.value)}
          placeholder="CPF do Funcionário"
        />
        <button onClick={addFuncionario}>Cadastrar Funcionário</button>
      </div>

      <div>
        <h2>Lista de Funcionários</h2>
        <ul>
          {funcionarios.map((funcionario) => (
            <li key={funcionario.id}>
              {funcionario.nome}
              <button onClick={() => deleteFuncionario(funcionario.id)}>Deletar</button>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h2>Cadastrar Tarefa</h2>
        <input
          type="text"
          value={newTarefa}
          onChange={(e) => setNewTarefa(e.target.value)}
          placeholder="Descrição da Tarefa"
        />
        <input
          type="number"
          value={funcionarioId}
          onChange={(e) => setFuncionarioId(e.target.value)}
          placeholder="ID do Funcionário"
        />
        <button onClick={addTarefa}>Cadastrar Tarefa</button>
      </div>

      <div>
        <h2>Lista de Tarefas</h2>
        <ul>
          {tarefas.map((tarefa) => (
            <li key={tarefa.id}>
              {tarefa.descricao} - {tarefa.funcionario?.nome}
              <button onClick={() => deleteTarefa(tarefa.id)}>Deletar</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;
