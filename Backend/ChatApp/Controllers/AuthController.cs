using Microsoft.AspNetCore.Mvc;

namespace ChatApp.Controllers;

[ApiController]
[Route("api/auth")]
public class AuthController : ControllerBase
{
    [HttpGet]
    public IActionResult GetTest()
    {
        return Ok("funcionando");
    }
}