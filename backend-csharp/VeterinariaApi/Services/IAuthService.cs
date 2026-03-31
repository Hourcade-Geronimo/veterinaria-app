using VeterinariaApi.DTOs.Auth;
using VeterinariaApi.DTOs.User;
using VeterinariaApi.Models;

namespace VeterinariaApi.Services;

public interface IAuthService
{
    Task<User?> RegisterAsync(RegisterDto dto);
    Task<string?> LoginAsync(LoginDto dto);
    Task<List<UserDto>> GetAllAsync();
    Task<UserDto?> GetByIdAsync(int id);
    Task<UserDto?> UpdateAsync(int id, UpdateUserDto dto);
    Task<bool> DeleteAsync(int id);
}
