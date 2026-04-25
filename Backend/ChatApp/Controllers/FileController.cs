using System.Security.Claims;
using ChatApp.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ChatApp.Controllers;

[Authorize]
[Route("api/[controller]")]
public class FileController(IConfiguration config, IFileService fileService) : ControllerBase
{
    private readonly long _fileMaxLengthInBytes = config.GetValue<long>("FILE_CONFIG:MAX_LENGTH_IN_BYTES");
    
    // [HttpPost]
    // [Route("upload/attachment")]
    // public IActionResult UploadFiles(List<IFormFile> files)
    // {
    //     if(files.Any(x => x.Length > _fileMaxLengthInBytes))
    //     {
    //         return BadRequest(new{Error = "O Arquivo é maior que o permitido!"});
    //     }
    //
    //     fileService.UploadAttachmentsAndGetUrlAsync(files);
    // }
    
    [HttpPost]
    [Route("upload/avatar")]
    public async Task<IActionResult> UploadFile(IFormFile file)
    {
        if(file.Length > _fileMaxLengthInBytes)
        {
            return BadRequest(new{Error = "O Arquivo é maior que o permitido!"});
        }
        
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

        var url = await fileService.UploadAvatarPhotoAndGetUrlAsync(file, Guid.Parse(userId!));

        if (url is null) return BadRequest(new{Error = "Não foi possivel fazer o upload devido um erro interno"});
        return StatusCode(201, url);
    }
}