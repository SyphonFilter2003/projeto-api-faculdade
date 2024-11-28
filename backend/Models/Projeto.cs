using System.Collections.Generic;

namespace Gerenciador.Models
{
    public class Projeto
    {
        public int Id { get; set; }
        public string? Nome { get; set; }
        public string? Descricao { get; set; }
        public DateTime DataInicio { get; set; }
        public DateTime? DataFim { get; set; }
        public bool Concluido { get; set; }

        // Relação com Tarefas
        public List<Tarefa>? Tarefas { get; set; }
    }
}
