namespace VeterinariaApi.DTOs.Auth;

public record RegisterDto(string Name, string Email, string Password, string Type = "employee");
