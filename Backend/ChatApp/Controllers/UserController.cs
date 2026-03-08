using System.Security.Claims;
using ChatApp.Dtos;
using ChatApp.Exceptions;
using ChatApp.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ChatApp.Controllers;

[Authorize]
[Route("api/user")]
public class UserController(IGetInfo userInfoService) : ControllerBase
{

    [HttpGet]
    public async Task<IActionResult> GetCurrentUserConfigData()
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (userId is null) return Unauthorized();

        try
        {
            var userConfigInfo =  await userInfoService.GetUserConfigInfo(userId);
            return Ok(userConfigInfo);
        }
        catch (ThisUserDontExistEx e)
        {
             return NotFound();
        }
    }

    [HttpPut]
    public async Task<IActionResult> UpdateUser([FromBody] UserConfigDTO newConfig)
    {
        
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (userId is null) return Unauthorized();

        try
        {
            var userNewData = await userInfoService.UpdateUserConfigInfo(userId, newConfig);
            return Ok(userNewData);
        }
        catch (ThisUserDontExistEx e)
        {
            return NotFound();
        }
        catch (UsernameAlreadyTaken e)
        {
            return BadRequest();
        }
    }
}