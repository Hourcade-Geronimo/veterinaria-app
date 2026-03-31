using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using VeterinariaApi.DTOs.User;
using VeterinariaApi.Services;

namespace VeterinariaApi.Controllers;

[ApiController]
[Route("api/users")]
[Authorize]
public class UsersController(IAuthService authService) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> GetAll() => Ok(await authService.GetAllAsync());

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var user = await authService.GetByIdAsync(id);
        return user is null ? NotFound() : Ok(user);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, UpdateUserDto dto)
    {
        var user = await authService.UpdateAsync(id, dto);
        return user is null ? NotFound() : Ok(user);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var deleted = await authService.DeleteAsync(id);
        return deleted ? NoContent() : NotFound();
    }
}
