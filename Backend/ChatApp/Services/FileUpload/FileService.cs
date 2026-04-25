using ChatApp.Dtos;
using ChatApp.Interfaces;

namespace ChatApp.Services.FileUpload;

public class FileService(ICloudProviderStrategy cloudProviderBucket) : IFileService
{
    public Task UploadAttachmentsAndGetUrlAsync(List<IFormFile> files)
    {
        throw new NotImplementedException();
    }

    public async Task<UrlAvatarDTO?> UploadAvatarPhotoAndGetUrlAsync(IFormFile file, Guid userId)
    {
        var key = cloudProviderBucket.GetKeyForAvatarUpload(userId);
        await cloudProviderBucket.UploadFileAsync(file, key);
        return new UrlAvatarDTO(cloudProviderBucket.GetUrlCdnByKeyAsync(key));
    }

    public Task RemoveFileAsync()
    {
        throw new NotImplementedException();
    }
}