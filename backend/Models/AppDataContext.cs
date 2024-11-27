using Microsoft.EntityFrameworkCore;

namespace Gerenciador.Models
{
    public class AppDataContext : DbContext
    {
        public DbSet<Funcionario> Funcionarios { get; set; }
        public DbSet<Tarefa> Tarefas { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.UseSqlite("Data Source=Task.db");
        }
    }
}
