using System;

namespace Gerenciador.Models
{
    public class Tarefa
    {
        public int Id { get; set; }
        public string? Descricao { get; set; }
        public DateTime DataCriacao { get; set; }
        public DateTime DataConclusao { get; set; }
        public bool Concluida { get; set; }
        public Funcionario? Funcionario { get; set; }
        public int FuncionarioId { get; set; }
    }
}
