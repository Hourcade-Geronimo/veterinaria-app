namespace VeterinariaApi.DTOs.User;

public record UserDto(int Id, string Name, string Email, string Type, DateTime CreatedAtTime);
