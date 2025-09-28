using API.Data;
using API.Interfaces;
using API.Services;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
// builder.Services.AddOpenApi();

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("SocialMediaConnection")));

// builder.Services.AddCors(options =>
// {
//     options.AddPolicy("CorsPolicy", policy =>
//     {
//         policy.AllowAnyHeader()
//               .AllowAnyMethod()
//               .WithOrigins("http://localhost:4200"); // Replace with your Angular app's URL
//     });
// });

builder.Services.AddCors();
builder.Services.AddScoped<ITokenService, TokenService>(); // Register the TokenService with the dependency injection container as a scoped service so that it can be injected into controllers and other services as needed.
// Scoped lifetime is appropriate for services that need to maintain state within a single request but should not persist beyond that request. This is the default lifetime for services in ASP.NET Core. It means that a new instance of the service will be created for each request.

var app = builder.Build();

// Configure the HTTP request pipeline.
app.UseCors(policy =>
    policy.AllowAnyHeader()
          .AllowAnyMethod()
          .WithOrigins("http://localhost:4200", "https://localhost:4200")); // Replace with your Angular app's URL


// if (app.Environment.IsDevelopment())
// {
//     app.MapOpenApi();
// }

// app.UseHttpsRedirection();

// app.UseAuthorization();

app.MapControllers();

app.Run();
