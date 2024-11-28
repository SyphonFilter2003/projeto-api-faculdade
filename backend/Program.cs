using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.Hosting;

using Gerenciador.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Adiciona o CORS para que permita as requisições.
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", builder =>
    {
        builder.AllowAnyOrigin()  
               .AllowAnyMethod()  
               .AllowAnyHeader(); 
    });
});

builder.Services.AddDbContext<AppDataContext>();

var app = builder.Build();

app.UseCors("AllowAll");

app.MapGet("/Gerenciador", () => "Sistema de Tarefas");

// Cadastro de Funcionários
app.MapPost("/Gerenciador/funcionario/cadastrar", async ([FromBody] Funcionario funcionario, AppDataContext ctx) => {
    ctx.Add(funcionario);
    await ctx.SaveChangesAsync();
    return Results.Created("", funcionario);
});

// Listagem de Funcionários
app.MapGet("/Gerenciador/funcionario/listar", (AppDataContext ctx) => {
    if (ctx.Funcionarios.Any())
        return Results.Ok(ctx.Funcionarios.ToList());
    return Results.NotFound("Nenhum funcionário encontrado.");
});

// Deletar Funcionário
app.MapDelete("/Gerenciador/funcionario/deletar/{id}", async ([FromRoute] int id, AppDataContext ctx) => {
    var funcionario = await ctx.Funcionarios.FindAsync(id);

    if (funcionario == null)
        return Results.NotFound("Funcionário não encontrada.");

    ctx.Funcionarios.Remove(funcionario);
    await ctx.SaveChangesAsync();

    return Results.Ok("Funcionário demitido com sucesso!");
});

// Cadastro de Tarefas
app.MapPost("/Gerenciador/tarefa/cadastrar", async ([FromBody] Tarefa tarefa, AppDataContext ctx) => {
    Funcionario? funcionario = ctx.Funcionarios.Find(tarefa.FuncionarioId);

    if (funcionario == null)
        return Results.NotFound("Funcionário não encontrado no banco de dados.");

    tarefa.Funcionario = funcionario;
    tarefa.DataCriacao = DateTime.Now;
    ctx.Add(tarefa);
    await ctx.SaveChangesAsync();

    return Results.Created("", tarefa);
});

// Listar Tarefas
app.MapGet("/Gerenciador/tarefa/listar", (AppDataContext ctx) => {
    if (ctx.Tarefas.Any())
        return Results.Ok(ctx.Tarefas.Include(t => t.Funcionario).ToList());

    return Results.NotFound("Nenhuma tarefa cadastrada.");
});

// Buscar Tarefa por Funcionário
app.MapGet("/Gerenciador/tarefa/buscar/{funcionarioId}", (int funcionarioId, AppDataContext ctx) => {
    var tarefas = ctx.Tarefas.Include(t => t.Funcionario).Where(t => t.FuncionarioId == funcionarioId).ToList();

    if (tarefas.Any())
        return Results.Ok(tarefas);

    return Results.NotFound("Nenhuma tarefa encontrada para este funcionário.");
});

// Editar Tarefa
app.MapPut("/Gerenciador/tarefa/editar/{id}", async ([FromRoute] int id, [FromBody] Tarefa tarefaAtualizada, AppDataContext ctx) => {
    var tarefa = await ctx.Tarefas.FindAsync(id);

    if (tarefa == null)
        return Results.NotFound("Tarefa não encontrada.");

    tarefa.Descricao = tarefaAtualizada.Descricao;
    tarefa.DataConclusao = tarefaAtualizada.DataConclusao;
    tarefa.Concluida = tarefaAtualizada.Concluida;
    
    ctx.Update(tarefa);
    await ctx.SaveChangesAsync();

    return Results.Ok(tarefa);
});

// Deletar Tarefa
app.MapDelete("/Gerenciador/tarefa/deletar/{id}", async ([FromRoute] int id, AppDataContext ctx) => {
    var tarefa = await ctx.Tarefas.FindAsync(id);

    if (tarefa == null)
        return Results.NotFound("Tarefa não encontrada.");

    ctx.Tarefas.Remove(tarefa);
    await ctx.SaveChangesAsync();

    return Results.Ok("Tarefa deletada com sucesso.");
});

//Cadastro de um novo projeto
app.MapPost("/Gerenciador/projeto/cadastrar", async ([FromBody] Projeto projeto, AppDataContext ctx) => {
    projeto.DataInicio = DateTime.Now;
    ctx.Add(projeto);
    await ctx.SaveChangesAsync();
    return Results.Created("", projeto);
});

//Obtenção de todos os projetos
app.MapGet("/Gerenciador/projeto/listar", (AppDataContext ctx) => {
    var projetos = ctx.Projetos.Include(p => p.Tarefas).ToList();
    if (projetos.Any())
        return Results.Ok(projetos);

    return Results.NotFound("Nenhum projeto encontrado.");
});

//Associar uma tarefa a um projeto
app.MapPut("/Gerenciador/projeto/adicionar-tarefa/{projetoId}/{tarefaId}", async (int projetoId, int tarefaId, AppDataContext ctx) => {
    var projeto = await ctx.Projetos.Include(p => p.Tarefas).FirstOrDefaultAsync(p => p.Id == projetoId);
    var tarefa = await ctx.Tarefas.FindAsync(tarefaId);

    if (projeto == null || tarefa == null)
        return Results.NotFound("Projeto ou Tarefa não encontrados.");

    projeto.Tarefas ??= new List<Tarefa>();
    projeto.Tarefas.Add(tarefa);
    ctx.Update(projeto);
    await ctx.SaveChangesAsync();

    return Results.Ok(projeto);
});

//Geração de relatório de tarefas para um funcionário
app.MapPost("/Gerenciador/relatorio/funcionario/{funcionarioId}", async (int funcionarioId, AppDataContext ctx) => {
    var funcionario = await ctx.Funcionarios.FindAsync(funcionarioId);
    if (funcionario == null)
        return Results.NotFound("Funcionário não encontrado.");

    var tarefas = ctx.Tarefas.Where(t => t.FuncionarioId == funcionarioId).ToList();
    var relatorio = new Relatorio
    {
        Descricao = $"Relatório de tarefas do funcionário {funcionario.Nome}",
        DataGeracao = DateTime.Now,
        FuncionarioId = funcionarioId,
        Funcionario = funcionario
    };

    ctx.Add(relatorio);
    await ctx.SaveChangesAsync();

    return Results.Ok(new { relatorio, tarefas });
});


app.Run();
