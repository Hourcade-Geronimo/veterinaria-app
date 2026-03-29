using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using VeterinariaApi.Data;
using VeterinariaApi.Services;

var builder = WebApplication.CreateBuilder(args);

// Database
builder.Services.AddDbContext<AppDbContext>(o =>
    o.UseSqlite(builder.Configuration.GetConnectionString("Default"))
);

// Dependency injection
builder.Services.AddScoped<IAuthService, AuthService>();

// JWT authentication
var jwtKey = builder.Configuration["Jwt:Key"]!;
builder
    .Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(o =>
    {
        o.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            ValidAudience = builder.Configuration["Jwt:Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey)),
        };
    });

builder.Services.AddAuthorization();
builder.Services.AddControllers();

// CORS — allows requests from Node gateway and Angular
builder.Services.AddCors(o =>
    o.AddPolicy(
        "Dev",
        p =>
            p.WithOrigins("http://localhost:3000", "http://localhost:4200")
                .AllowAnyHeader()
                .AllowAnyMethod()
    )
);

var app = builder.Build();

// Auto-create database on startup if it doesn't exist
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    db.Database.EnsureCreated();
}

app.UseCors("Dev");
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();
app.Run();
