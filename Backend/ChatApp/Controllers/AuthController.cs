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
        if (req.UserName.Length > 32) return BadRequest(new {statusCode = 400, msg = "Your Username is too long", success = false});
        String? id = await authService.RegisterUser(req);
        if (id == null) return BadRequest(new {statusCode = 400, msg = "This user already have a account", success = false});
        return StatusCode(StatusCodes.Status201Created, new {statusCode = 201, msg = id, success = true});
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login(LoginUserRequest req)
    {
        if (req.UserName.Length > 32) return BadRequest(new {statusCode = 400, msg = "Your Username is too long", success = false});
        String? token = await authService.Login(req);
        if (token == null) return BadRequest(new {statusCode = 400, msg = "Username or password is incorrect", success = false} );
        return Ok(new {statusCode = 200, msg = token, success = true});
    }
}
