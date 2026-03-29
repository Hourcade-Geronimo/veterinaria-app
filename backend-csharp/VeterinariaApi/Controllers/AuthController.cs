using Microsoft.AspNetCore.Mvc;
using VeterinariaApi.DTOs.Auth;
using VeterinariaApi.Services;

namespace VeterinariaApi.Controllers;

[ApiController]
[Route("apt/auth")]
public class AuthController(IAuthService authService) : ControllerBase
{
    [HttpPost("register")]
    public async Task<IActionResult> Register(RegisterDto dto)
    {
        var user = await authService.RegisterAsync(dto);

        if (user is null)
            return Conflict(new { error = "Email already registered" });

        return Ok(
            new
            {
                user.Id,
                user.Name,
                user.Email,
                user.Type,
            }
        );
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login(LoginDto dto)
    {
        var token = await authService.LoginAsync(dto);

        if (token is null)
            return Unauthorized(new { error = "Invalid credentials" });

        return Ok(new { token });
    }
}
