import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

// URL base da API
const API_URL = 'http://localhost:5181/Gerenciador';

function App() {
  const [funcionarios, setFuncionarios] = useState([]);
  const [tarefas, setTarefas] = useState([]);
  const [projetos, setProjetos] = useState([]);
  const [relatorios, setRelatorios] = useState([]);

  const [newFuncionario, setNewFuncionario] = useState('');
  const [newFuncionarioCpf, setNewFuncionarioCpf] = useState('');
  const [newTarefa, setNewTarefa] = useState('');
  const [funcionarioId, setFuncionarioId] = useState('');
  const [newProjetoNome, setNewProjetoNome] = useState('');
  const [newProjetoDescricao, setNewProjetoDescricao] = useState('');
  const [newProjetoDataInicio, setNewProjetoDataInicio] = useState('');
  const [newProjetoDataFim, setNewProjetoDataFim] = useState('');
  const [newProjetoConcluido, setNewProjetoConcluido] = useState(false);
  const [newRelatorioDescricao, setNewRelatorioDescricao] = useState('');
  const [funcionarioIdRelatorio, setFuncionarioIdRelatorio] = useState('');

  const [projetoId, setProjetoId] = useState('');
  const [tarefaId, setTarefaId] = useState('');

  const fetchFuncionarios = async () => {
    try {
      const response = await axios.get(`${API_URL}/funcionario/listar`);
      setFuncionarios(response.data);
    } catch (error) {
      console.error('Erro ao buscar funcionários', error);
    }
  };

  const fetchTarefas = async () => {
    try {
      const response = await axios.get(`${API_URL}/tarefa/listar`);
      setTarefas(response.data);
    } catch (error) {
      console.error('Erro ao buscar tarefas', error);
    }
  };

  const fetchProjetos = async () => {
    try {
      const response = await axios.get(`${API_URL}/projeto/listar`);
      setProjetos(response.data);
    } catch (error) {
      console.error('Erro ao buscar projetos', error);
    }
  };

  const fetchRelatorios = async () => {
    try {
      const response = await axios.get(`${API_URL}/relatorio/listar`);
      setRelatorios(response.data);
    } catch (error) {
      console.error('Erro ao buscar relatórios', error);
    }
  };

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

  const addProjeto = async () => {
    if (!newProjetoNome || !newProjetoDescricao || !newProjetoDataInicio) return;

    const projeto = {
      nome: newProjetoNome,
      descricao: newProjetoDescricao,
      dataInicio: newProjetoDataInicio,
      dataFim: newProjetoDataFim,
      concluido: newProjetoConcluido,
    };
    try {
      await axios.post(`${API_URL}/projeto/cadastrar`, projeto);
      setNewProjetoNome('');
      setNewProjetoDescricao('');
      setNewProjetoDataInicio('');
      setNewProjetoDataFim('');
      setNewProjetoConcluido(false);
      fetchProjetos();
    } catch (error) {
      console.error('Erro ao cadastrar projeto', error);
    }
  };

  const addRelatorio = async () => {
    if (!newRelatorioDescricao || !funcionarioIdRelatorio) return;

    const relatorio = { descricao: newRelatorioDescricao, funcionarioId: parseInt(funcionarioIdRelatorio) };
    try {
      await axios.post(`${API_URL}/relatorio/funcionario/${funcionarioIdRelatorio}`, relatorio);
      setNewRelatorioDescricao('');
      setFuncionarioIdRelatorio('');
      fetchRelatorios();
    } catch (error) {
      console.error('Erro ao cadastrar relatório', error);
    }
  };

  const addTarefaAoProjeto = async () => {
    if (!projetoId || !tarefaId) return;

    try {
      await axios.put(`${API_URL}/projeto/adicionar-tarefa/${projetoId}/${tarefaId}`);
      alert('Tarefa adicionada ao projeto com sucesso!');
      fetchProjetos(); // Atualiza a lista de projetos
    } catch (error) {
      console.error('Erro ao adicionar tarefa ao projeto', error);
      alert('Erro ao adicionar tarefa ao projeto');
    }
  };

  const deleteTarefa = async (id) => {
    try {
      await axios.delete(`${API_URL}/tarefa/deletar/${id}`);
      fetchTarefas();
    } catch (error) {
      console.error('Erro ao deletar tarefa', error);
    }
  };

  const deleteFuncionario = async (id) => {
    try {
      await axios.delete(`${API_URL}/funcionario/deletar/${id}`);
      fetchFuncionarios();
    } catch (error) {
      console.error('Erro ao deletar funcionário', error);
    }
  };

  const deleteProjeto = async (id) => {
    try {
      await axios.delete(`${API_URL}/projeto/deletar/${id}`);
      fetchProjetos();
    } catch (error) {
      console.error('Erro ao deletar projeto', error);
    }
  };

  const deleteRelatorio = async (id) => {
    try {
      await axios.delete(`${API_URL}/relatorio/deletar/${id}`);
      fetchRelatorios();
    } catch (error) {
      console.error('Erro ao deletar relatório', error);
    }
  };

  useEffect(() => {
    fetchFuncionarios();
    fetchTarefas();
    fetchProjetos();
    fetchRelatorios();
  }, []);

  return (
    <div className="App">
      <h1>Gerenciador de Funcionários, Tarefas, Projetos e Relatórios</h1>

      <div className="App">
      <h1>Gerenciador de Funcionários, Tarefas, Projetos e Relatórios</h1>

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

      <div>
        <h2>Cadastrar Projeto</h2>
        <input
          type="text"
          value={newProjetoNome}
          onChange={(e) => setNewProjetoNome(e.target.value)}
          placeholder="Nome do Projeto"
        />
        <input
          type="text"
          value={newProjetoDescricao}
          onChange={(e) => setNewProjetoDescricao(e.target.value)}
          placeholder="Descrição do Projeto"
        />
        <input
          type="date"
          value={newProjetoDataInicio}
          onChange={(e) => setNewProjetoDataInicio(e.target.value)}
        />
        <input
          type="date"
          value={newProjetoDataFim}
          onChange={(e) => setNewProjetoDataFim(e.target.value)}
        />
        <label>
          Concluído:
          <input
            type="checkbox"
            checked={newProjetoConcluido}
            onChange={(e) => setNewProjetoConcluido(e.target.checked)}
          />
        </label>
        <button onClick={addProjeto}>Cadastrar Projeto</button>
      </div>

      <div>
        <h2>Lista de Projetos</h2>
        <ul>
          {projetos.map((projeto) => (
            <li key={projeto.id}>
              <h3>{projeto.nome}</h3>
              <p>{projeto.descricao}</p>
              <p>Data Início: {projeto.dataInicio}</p>
              <p>Data Fim: {projeto.dataFim ? projeto.dataFim : 'Em andamento'}</p>
              <p>Status: {projeto.concluido ? 'Concluído' : 'Em andamento'}</p>
              <button onClick={() => deleteProjeto(projeto.id)}>Deletar</button>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h2>Cadastrar Relatório</h2>
        <input
          type="text"
          value={newRelatorioDescricao}
          onChange={(e) => setNewRelatorioDescricao(e.target.value)}
          placeholder="Descrição do Relatório"
        />
        <select
          value={funcionarioIdRelatorio}
          onChange={(e) => setFuncionarioIdRelatorio(e.target.value)}
        >
          <option value="">Selecione o Funcionário</option>
          {funcionarios.map((funcionario) => (
            <option key={funcionario.id} value={funcionario.id}>
              {funcionario.nome}
            </option>
          ))}
        </select>
        <button onClick={addRelatorio}>Cadastrar Relatório</button>
      </div>

      <div>
        <h2>Lista de Relatórios</h2>
        <ul>
          {relatorios.map((relatorio) => (
            <li key={relatorio.id}>
              <h3>{relatorio.descricao}</h3>
              <p>Funcionário: {relatorio.funcionario?.nome}</p>
              <button onClick={() => deleteRelatorio(relatorio.id)}>Deletar</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  
      <div>
        <h2>Adicionar Tarefa ao Projeto</h2>
        <select value={projetoId} onChange={(e) => setProjetoId(e.target.value)}>
          <option value="">Selecione um Projeto</option>
          {projetos.map((projeto) => (
            <option key={projeto.id} value={projeto.id}>
              {projeto.nome}
            </option>
          ))}
        </select>
        <select value={tarefaId} onChange={(e) => setTarefaId(e.target.value)}>
          <option value="">Selecione uma Tarefa</option>
          {tarefas.map((tarefa) => (
            <option key={tarefa.id} value={tarefa.id}>
              {tarefa.descricao}
            </option>
          ))}
        </select>
        <button onClick={addTarefaAoProjeto}>Adicionar Tarefa ao Projeto</button>
      </div>
    </div>
  );
}

export default App;
