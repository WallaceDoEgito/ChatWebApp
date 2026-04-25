namespace ChatApp.Interfaces;

public interface ICloudProviderStrategy
{
    public Task UploadFileAsync(IFormFile file, string key);
    public string GetUrlCdnByKeyAsync(string key);
    public string GetKeyForAvatarUpload(Guid userId);
}