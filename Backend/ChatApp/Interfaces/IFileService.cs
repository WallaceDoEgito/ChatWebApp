using ChatApp.Dtos;

namespace ChatApp.Interfaces;

public interface IFileService
{
    public Task UploadAttachmentsAndGetUrlAsync(List<IFormFile> files);
    public Task<UrlAvatarDTO?> UploadAvatarPhotoAndGetUrlAsync(IFormFile file, Guid userId);
    public Task RemoveFileAsync();
}