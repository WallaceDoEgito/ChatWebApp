using ChatApp.Dtos;
using ChatApp.Interfaces;
using ChatApp.Services;
using Microsoft.AspNetCore.Mvc;

namespace ChatApp.Controllers;

[ApiController]
[Route("api/auth")]
public class AuthController(IAuthService authService) : ControllerBase
{
    [HttpPost("register")]
    public async Task<IActionResult> RegisterUser(RegisterUserRequest req)
    {
        if (req.UserName.Length > 32) return BadRequest("Your Username is too long");
        String? id = await authService.RegisterUser(req);
        if (id == null)
            return StatusCode(StatusCodes.Status500InternalServerError,
                new { msg = "Nao foi possivel criar o usuario tente mais tarde" });
        return StatusCode(StatusCodes.Status201Created, id);
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login(LoginUserRequest req)
    {
        if (req.UserName.Length > 32) return BadRequest("Your Username is too long");
        String? token = await authService.Login(req);
        if (token == null) return BadRequest("Username or password is incorrect");
        return Ok(token);
    }
}