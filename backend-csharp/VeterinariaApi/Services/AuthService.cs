using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using VeterinariaApi.Data;
using VeterinariaApi.DTOs.Auth;
using VeterinariaApi.DTOs.User;
using VeterinariaApi.Models;

namespace VeterinariaApi.Services;

public class AuthService(AppDbContext db, IConfiguration config) : IAuthService
{
    public async Task<User?> RegisterAsync(RegisterDto dto)
    {
        if (await db.Users.AnyAsync(u => u.Email == dto.Email))
            return null;

        var user = new User
        {
            Name = dto.Name,
            Email = dto.Email,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password),
            Type = dto.Type,
        };

        db.Users.Add(user);
        await db.SaveChangesAsync();
        return user;
    }

    public async Task<string?> LoginAsync(LoginDto dto)
    {
        var user = await db.Users.FirstOrDefaultAsync(u => u.Email == dto.Email);

        // User not found or wrong password
        if (user is null)
            return null;
        if (!BCrypt.Net.BCrypt.Verify(dto.Password, user.PasswordHash))
            return null;

        return GenerateJwt(user);
    }

    public async Task<List<UserDto>> GetAllAsync() =>
        await db
            .Users.Select(u => new UserDto(u.Id, u.Name, u.Email, u.Type, u.CreatedAtTime))
            .ToListAsync();

    public async Task<UserDto?> GetByIdAsync(int id)
    {
        var user = await db.Users.FindAsync(id);
        return user is null
            ? null
            : new UserDto(user.Id, user.Name, user.Email, user.Type, user.CreatedAtTime);
    }

    public async Task<UserDto?> UpdateAsync(int id, RegisterDto dto)
    {
        var user = await db.Users.FindAsync(id);
        if (user is null)
            return null;

        user.Name = dto.Name;
        user.Email = dto.Email;
        user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password);
        user.Type = dto.Type;

        await db.SaveChangesAsync();
        return new UserDto(user.Id, user.Name, user.Email, user.Type, user.CreatedAtTime);
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var user = await db.Users.FindAsync(id);
        if (user is null)
            return false;

        db.Users.Remove(user);
        await db.SaveChangesAsync();
        return true;
    }

    private string GenerateJwt(User user)
    {
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(config["Jwt:Key"]!));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var claims = new[]
        {
            new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new Claim(ClaimTypes.Email, user.Email),
            new Claim(ClaimTypes.Role, user.Type),
        };

        var token = new JwtSecurityToken(
            issuer: config["Jwt:Issuer"],
            audience: config["Jwt:Audience"],
            claims: claims,
            expires: DateTime.UtcNow.AddHours(8),
            signingCredentials: creds
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}
