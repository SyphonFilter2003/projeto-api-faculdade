namespace Gerenciador.Models
{
    public class Relatorio
    {
        public int Id { get; set; }
        public string? Descricao { get; set; }
        public DateTime DataGeracao { get; set; }

        // Relacionamento com Funcionário
        public int FuncionarioId { get; set; }
        public Funcionario? Funcionario { get; set; }

        // Relação com Projeto (opcional)
        public int? ProjetoId { get; set; }
        public Projeto? Projeto { get; set; }
    }
}
