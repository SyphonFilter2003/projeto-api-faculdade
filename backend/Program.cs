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


app.Run();