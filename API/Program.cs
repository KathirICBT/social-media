using System.Text;
using API.Data;
using API.Interfaces;
using API.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

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

// JWT Authentication and Authorization Setup 
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme) // Add authentication services to the container. This will enable JWT-based authentication for the API.
    .AddJwtBearer(options => // Configure the JWT bearer authentication options. This will specify how the JWT token should be validated and used for authentication.
    {
        var TokenKey = builder.Configuration["TokenKey"] // Get the secret key used to sign the JWT tokens from the configuration file. This key is used to validate the token's signature and ensure that it has not been tampered with.
            ?? throw new InvalidOperationException("TokenKey is not configured."); // If the TokenKey is not found in the configuration, throw an exception to indicate that the application cannot start without it. This is a safeguard to ensure that the application does not start with an invalid or missing key.
        options.TokenValidationParameters = new TokenValidationParameters // Create a new instance of the TokenValidationParameters class to specify the validation parameters for the JWT token.
        {
            ValidateIssuerSigningKey = true, // Enable validation of the token's signing key to ensure that it is valid and has not been tampered with. This is a critical security measure to prevent unauthorized access to the API.
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(TokenKey)), // Set the signing key to the secret key obtained from the configuration file. This key is used to validate the token's signature.
            ValidateIssuer = false, // Disable validation of the token's issuer. This means that the token can be issued by any trusted authority and does not need to match a specific issuer. This is useful for applications that use multiple issuers or want to allow tokens issued by different authorities.
            ValidateAudience = false // Disable validation of the token's audience. This means that the token can be used by any audience and does not need to match a specific audience. This is useful for applications that want to allow tokens to be used by multiple audiences or do not require strict audience validation.
        };
    });

var app = builder.Build();

// Configure the HTTP request pipeline.
app.UseCors(policy =>
    policy.AllowAnyHeader()
          .AllowAnyMethod()
          .WithOrigins("http://localhost:4200", "https://localhost:4200")); // Replace with your Angular app's URL

app.UseAuthentication(); // Add the authentication middleware to the request pipeline. This will enable authentication for the API. The authentication middleware will check the user's credentials and ensure that they have the necessary credentials to access the requested resources.
app.UseAuthorization(); // Add the authorization middleware to the request pipeline. This will enable authorization for the API. The authorization middleware will check the user's permissions and ensure that they have the necessary permissions to access the requested resources.

// if (app.Environment.IsDevelopment())
// {
//     app.MapOpenApi();
// }

// app.UseHttpsRedirection();

// app.UseAuthorization();

app.MapControllers();

app.Run();
